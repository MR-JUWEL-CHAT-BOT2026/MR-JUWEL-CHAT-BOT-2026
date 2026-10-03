const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "safety",
  version: "4.1.0",
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Group name & photo safety lock — backup, restore, warn & kick",
  eventType: ["log:thread-name", "log:thread-icon", "log:thread-image"],
  cooldowns: 3
};

// মেমোরিতে কুলডাউন ট্র্যাক (একই ইউজারকে বারবার কিক করা রোধে)
const cooldownMap = new Map();

module.exports.run = async function ({ api, event }) {
  try {
    const threadID = event.threadID;
    const senderID = event.author || event.senderID;

    // senderID না থাকলে কিছুই করা যাবে না
    if (!senderID) return;

    const dir = `${__dirname}/../../cache/safety/`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const dataFile = dir + `${threadID}.json`;

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = (threadInfo.adminIDs || []).map(i => i.id);
    const botID = api.getCurrentUserID();
    const isAdmin = adminIDs.includes(senderID);
    const botAdmin = adminIDs.includes(botID);

    // বট অ্যাডমিন না হলে কিছুই করবে না
    if (!botAdmin) {
      console.log("[SAFETY] Bot is not admin in this group.");
      return;
    }

    // বট নিজে বা অ্যাডমিন কিছু করলে snapshot আপডেট করে দাও
    const updateSnapshot = async () => {
      let imageData = null;
      try {
        if (threadInfo.imageSrc) {
          const res = await axios.get(threadInfo.imageSrc, {
            responseType: "arraybuffer",
            timeout: 15000
          });
          imageData = Buffer.from(res.data).toString("base64");
        }
      } catch (e) {
        // ইমেজ ডাউনলোড ফেইল হলে আগেরটা রাখো
        if (fs.existsSync(dataFile)) {
          try {
            const oldData = JSON.parse(fs.readFileSync(dataFile));
            imageData = oldData.image;
          } catch (_) {}
        }
      }

      const snap = {
        name: threadInfo.threadName || "",
        image: imageData,
        updatedAt: Date.now()
      };
      fs.writeFileSync(dataFile, JSON.stringify(snap, null, 2));
      console.log("[SAFETY] Snapshot updated for", threadID);
    };

    // প্রথমবার snapshot সেভ
    if (!fs.existsSync(dataFile)) {
      await updateSnapshot();
      return;
    }

    // অ্যাডমিন বা বট নিজে চেঞ্জ করলে ব্যাকআপ আপডেট
    if (isAdmin || senderID === botID) {
      await updateSnapshot();
      return;
    }

    // কুলডাউন চেক — একই ইউজারকে ৫ সেকেন্ডে একবারের বেশি হ্যান্ডেল করবো না
    const cdKey = `${threadID}_${senderID}`;
    const now = Date.now();
    if (cooldownMap.has(cdKey) && now - cooldownMap.get(cdKey) < 5000) {
      return;
    }
    cooldownMap.set(cdKey, now);

    const old = JSON.parse(fs.readFileSync(dataFile));

    // ⛔ নোটিশ মেসেজ
    const noticeMsg =
`╭───────────────────╮
   🛡️ 𝗦𝗔𝗙𝗘𝗧𝗬 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡 🛡️
╰───────────────────╯

🚫 এই গ্রুপের নাম ও ছবি পরিবর্তন করা যাবে না!
👤 ইউজার: ${senderID}
📌 কারণ: অনুমতি ছাড়া গ্রুপ সেটিংস পরিবর্তন

⚙️ আগের অবস্থায় ফিরিয়ে আনা হচ্ছে...
⏳ ৫ সেকেন্ড পর ইউজারকে কিক করা হবে।

╭───────────────────╮
   ✨ 𝗧𝗛𝗔𝗡𝗞 𝗬𝗢𝗨 ✨
╰───────────────────╯`;

    const type = event.logMessageType;

    // ===== নাম পরিবর্তন =====
    if (type === "log:thread-name") {
      try {
        await api.setTitle(old.name || "", threadID);
      } catch (e) {
        console.log("[SAFETY] setTitle error:", e.message);
      }

      try {
        await api.sendMessage(noticeMsg, threadID);
      } catch (e) {}

      scheduleKick(api, senderID, threadID, "নাম পরিবর্তন", old.name, "name");
      return;
    }

    // ===== ছবি পরিবর্তন =====
    if (type === "log:thread-icon" || type === "log:thread-image") {
      try {
        if (old.image) {
          const buf = Buffer.from(old.image, "base64");
          await api.changeGroupImage(buf, threadID);
        }
      } catch (e) {
        console.log("[SAFETY] changeGroupImage error:", e.message);
      }

      try {
        await api.sendMessage(noticeMsg, threadID);
      } catch (e) {}

      scheduleKick(api, senderID, threadID, "ছবি পরিবর্তন", null, "icon");
      return;
    }
  } catch (e) {
    console.log("[SAFETY] Error:", e);
  }
};

// কিক করার হেল্পার ফাংশন
function scheduleKick(api, userID, threadID, reason, oldName, type) {
  setTimeout(async () => {
    try {
      await api.removeUserFromGroup(userID, threadID);

      const extra = type === "name"
        ? `✅ আগের নাম পুনরায় সেট করা হয়েছে: "${oldName}"`
        : `✅ আগের ছবি পুনরায় সেট করা হয়েছে।`;

      await api.sendMessage(
`╭───────────────────╮
   ⚠️ 𝗨𝗦𝗘𝗥 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 ⚠️
╰───────────────────╯

👤 ইউজার: ${userID}
📌 কারণ: অনুমতি ছাড়া গ্রুপের ${reason} করা হয়েছে।

${extra}

╭───────────────────╮
   🛡️ 𝗦𝗔𝗙𝗘𝗧𝗬 𝗦𝗬𝗦𝗧𝗘𝗠 🛡️
╰───────────────────╯`,
        threadID
      );
    } catch (e) {
      console.log(`[SAFETY] Kick error (${type}):`, e.message);
    }
  }, 5000);
}
