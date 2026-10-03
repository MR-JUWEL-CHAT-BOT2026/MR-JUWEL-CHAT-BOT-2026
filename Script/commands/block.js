const fs = require("fs-extra");
const path = require("path");

const BLOCK_FILE = path.join(__dirname, "blockedUsers.json");

// =========================
// 💾 BACKUP SYSTEM
// =========================
if (fs.existsSync(BLOCK_FILE)) {
  const backupFile = path.join(__dirname, "blockedUsers_backup.json");

  if (!fs.existsSync(backupFile)) {
    try {
      fs.copySync(BLOCK_FILE, backupFile);
      console.log("💾 ব্যাকআপ সংরক্ষিত: blockedUsers_backup.json");
    } catch (err) {
      console.error("❌ ব্যাকআপ ব্যর্থ:", err.message);
    }
  }
}

// =========================
// GLOBAL DATA INIT
// =========================
if (!global.data) global.data = {};
if (!global.data.userBlocked) {
  global.data.userBlocked = new Map();
}

// =========================
// LOAD BLOCK DATA
// =========================
function loadBlock() {
  try {
    if (!fs.existsSync(BLOCK_FILE)) {
      fs.writeFileSync(BLOCK_FILE, JSON.stringify({}, null, 2));
      console.log("📄 নতুন blockedUsers.json তৈরি করা হয়েছে");
      return;
    }

    const data = JSON.parse(
      fs.readFileSync(BLOCK_FILE, "utf8")
    );

    global.data.userBlocked.clear();

    for (const id in data) {
      global.data.userBlocked.set(id, data[id]);
    }

    console.log(
      `✅ Block data loaded: ${global.data.userBlocked.size} জন`
    );
  } catch (error) {
    console.error("❌ Block data load error:", error);

    fs.writeFileSync(
      BLOCK_FILE,
      JSON.stringify({}, null, 2)
    );
  }
}

// =========================
// SAVE BLOCK DATA
// =========================
function saveBlock() {
  try {
    const obj = Object.fromEntries(
      global.data.userBlocked
    );

    fs.writeFileSync(
      BLOCK_FILE,
      JSON.stringify(obj, null, 2)
    );

    console.log(
      `💾 Block data saved: ${Object.keys(obj).length} জন`
    );
  } catch (error) {
    console.error("❌ Block data save error:", error);
  }
}

// =========================
// INITIAL LOAD
// =========================
loadBlock();

// =========================
// CONFIG
// =========================
module.exports.config = {
  name: "block",
  version: "1.0.0",
  hasPermssion: 2,
  credits:
    "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description:
    "Block users from sending messages to the bot",
  commandCategory: "admin",
  cooldowns: 3
};

// =========================
// HANDLE EVENT
// =========================
module.exports.handleEvent = async ({ event, api }) => {
  try {
    const senderID = event.senderID;

    if (!senderID) return;

    // =========================
    // BOT OWNER / ADMIN PROTECTION
    // =========================
    if (
      global.config &&
      global.config.ADMINBOT &&
      global.config.ADMINBOT.includes(senderID)
    ) {
      return;
    }

    // =========================
    // CHECK BLOCK
    // =========================
    if (!global.data.userBlocked.has(String(senderID))) {
      return;
    }

    /*
      এখানে ইচ্ছা করে কোনো reply পাঠানো হচ্ছে না।
      ফলে blocked user-এর message bot ignore করবে।
    */

    return;
  } catch (error) {
    console.error("❌ Block handleEvent error:", error);
  }
};

// =========================
// COMMAND
// =========================
module.exports.run = async ({ event, api, args }) => {
  try {
    const {
      threadID,
      messageID,
      messageReply,
      mentions
    } = event;

    const fullMsg = event.body || "";

    const cmd = fullMsg
      .split(" ")[0]
      .toLowerCase();

    // =========================
    // TARGET ID
    // =========================
    let targetID = null;

    // 1️⃣ Reply
    if (messageReply) {
      targetID = messageReply.senderID;
    }

    // 2️⃣ Mention
    else if (
      mentions &&
      Object.keys(mentions).length > 0
    ) {
      targetID = Object.keys(mentions)[0];
    }

    // 3️⃣ UID
    else if (args.length > 0) {
      targetID = args[0];
    }

    // =========================
    // BLOCK
    // =========================
    if (
      cmd === "block" ||
      cmd === "/block"
    ) {
      if (!targetID) {
        return api.sendMessage(
          `╔══════ BLOCK ══════╗

⚠️ ইউজার নির্বাচন করুন।

📌 ব্যবহার:

➜ block @user
➜ block UID
➜ কোনো মেসেজে Reply করে block

╚══════════════════╝`,
          threadID,
          messageID
        );
      }

      targetID = String(targetID);

      // UID validation
      if (!/^\d+$/.test(targetID)) {
        return api.sendMessage(
          "❌ সঠিক UID দিন!",
          threadID,
          messageID
        );
      }

      // =========================
      // ALREADY BLOCKED
      // =========================
      if (
        global.data.userBlocked.has(targetID)
      ) {
        const oldData =
          global.data.userBlocked.get(targetID);

        return api.sendMessage(
          `╔════ BLOCK ════╗

⚠️ এই ইউজার ইতিমধ্যে Block করা আছে!

👤 নাম: ${
            oldData.userName || "অজানা"
          }

🆔 UID: ${targetID}

👮 Block করেছেন:
${
            oldData.byName || "অজানা"
          }

╚══════════════╝`,
          threadID,
          messageID
        );
      }

      // =========================
      // USER INFO
      // =========================
      let userName = "অজানা";

      try {
        const userInfo =
          await api.getUserInfo(targetID);

        if (
          userInfo &&
          userInfo[targetID]
        ) {
          userName =
            userInfo[targetID].name ||
            "অজানা";
        }
      } catch (error) {
        console.log(
          "⚠️ User info পাওয়া যায়নি"
        );
      }

      // =========================
      // ADMIN NAME
      // =========================
      let byName = "অজানা";

      try {
        const adminInfo =
          await api.getUserInfo(
            event.senderID
          );

        if (
          adminInfo &&
          adminInfo[event.senderID]
        ) {
          byName =
            adminInfo[event.senderID].name ||
            "অজানা";
        }
      } catch (error) {
        console.log(
          "⚠️ Admin name পাওয়া যায়নি"
        );
      }

      // =========================
      // SAVE BLOCK
      // =========================
      const blockInfo = {
        userName: userName,
        by: event.senderID,
        byName: byName,
        time: Date.now()
      };

      global.data.userBlocked.set(
        targetID,
        blockInfo
      );

      saveBlock();

      // =========================
      // SUCCESS UI
      // =========================
      return api.sendMessage(
        `╔══════ BLOCK ══════╗

🚫 BLOCK SUCCESSFUL

👤 ইউজার:
${userName}

🆔 UID:
${targetID}

👮 Block করেছেন:
${byName}

🕐 সময়:
${new Date().toLocaleString(
          "bn-BD"
        )}

📌 Status:
🔴 BLOCKED

🤖 এখন এই ইউজারের
মেসেজ Bot গ্রহণ করবে না।

╚══════════════════╝

乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐`,
        threadID,
        messageID
      );
    }

    // =========================
    // UNBLOCK
    // =========================
    if (
      cmd === "unblock" ||
      cmd === "/unblock"
    ) {
      if (!targetID) {
        return api.sendMessage(
          "⚠️ UID / @mention / Reply দিন।",
          threadID,
          messageID
        );
      }

      targetID = String(targetID);

      if (
        !global.data.userBlocked.has(
          targetID
        )
      ) {
        return api.sendMessage(
          "⚠️ এই ইউজার Block করা নেই।",
          threadID,
          messageID
        );
      }

      const blockInfo =
        global.data.userBlocked.get(
          targetID
        );

      global.data.userBlocked.delete(
        targetID
      );

      saveBlock();

      return api.sendMessage(
        `╔════ UNBLOCK ════╗

🟢 UNBLOCK SUCCESSFUL

👤 ইউজার:
${blockInfo.userName || "অজানা"}

🆔 UID:
${targetID}

📌 Status:
🟢 UNBLOCKED

✅ এখন থেকে Bot-এর
মেসেজ গ্রহণ করতে পারবে।

╚══════════════════╝

乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐`,
        threadID,
        messageID
      );
    }

    // =========================
    // BLOCK LIST
    // =========================
    if (
      cmd === "blocklist" ||
      cmd === "/blocklist"
    ) {
      const blockedUsers =
        Array.from(
          global.data.userBlocked.entries()
        );

      if (blockedUsers.length === 0) {
        return api.sendMessage(
          `╔══ BLOCK LIST ══╗

📋 কোনো ইউজার Block করা নেই।

╚════════════════╝`,
          threadID,
          messageID
        );
      }

      let list =
        `╔════ BLOCK LIST ════╗\n`;

      let count = 1;

      for (
        const [id, data]
        of blockedUsers
      ) {
        list += `
${count}. 👤 ${
          data.userName || "অজানা"
        }
🆔 ${id}
👮 ${
          data.byName || "অজানা"
        }
🕐 ${
          new Date(
            data.time
          ).toLocaleString("bn-BD")
        }
━━━━━━━━━━━━━━`;

        count++;
      }

      list += `
╚════════════════════╝

🔢 মোট Block:
${blockedUsers.length}

乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐`;

      return api.sendMessage(
        list,
        threadID,
        messageID
      );
    }

    // =========================
    // HELP / UI
    // =========================
    if (
      cmd === "blockhelp" ||
      cmd === "/blockhelp"
    ) {
      return api.sendMessage(
        `╔════ BLOCK SYSTEM ════╗

🚫 BLOCK COMMAND

➜ block @user
মেনশন করা ইউজার Block

➜ block UID
UID দিয়ে ইউজার Block

➜ Reply করে block
যে ইউজারের মেসেজে Reply
করে command দিলে Block হবে

🟢 UNBLOCK

➜ unblock @user
➜ unblock UID
➜ Reply করে unblock

📋 LIST

➜ blocklist

ℹ️ Block করা ইউজারের
message Bot ignore করবে।

╚════════════════════════╝

👑 Credit:
乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐`,
        threadID,
        messageID
      );
    }

  } catch (error) {
    console.error(
      "❌ Block command error:",
      error
    );

    return api.sendMessage(
      "❌ Block command চালাতে সমস্যা হয়েছে।",
      event.threadID,
      event.messageID
    );
  }
};
