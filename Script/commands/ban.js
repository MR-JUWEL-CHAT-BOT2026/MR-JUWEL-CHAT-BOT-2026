const fs = require("fs-extra");
const path = require("path");

const BAN_FILE = path.join(__dirname, "bannedUsers.json");

// =========================
// 📋 ব্যাকআপ সিস্টেম
// =========================
if (fs.existsSync(BAN_FILE)) {
  const backupFile = path.join(__dirname, "bannedUsers_backup.json");
  if (!fs.existsSync(backupFile)) {
    try {
      fs.copySync(BAN_FILE, backupFile);
      console.log("💾 ব্যাকআপ সংরক্ষিত: bannedUsers_backup.json");
    } catch (err) {
      console.error("❌ ব্যাকআপ ব্যর্থ:", err.message);
    }
  }
}

// =========================
// GLOBAL DATA INIT
// =========================
if (!global.data) global.data = {};
if (!global.data.userBanned) global.data.userBanned = new Map();

// =========================
// LOAD BAN DATA
// =========================
function loadBan() {
  try {
    if (!fs.existsSync(BAN_FILE)) {
      fs.writeFileSync(BAN_FILE, JSON.stringify({}, null, 2));
      console.log("📄 নতুন ব্যান ফাইল তৈরি করা হয়েছে");
      return;
    }

    const data = JSON.parse(fs.readFileSync(BAN_FILE, "utf8"));
    
    global.data.userBanned.clear();
    for (let id in data) {
      // শুধু মেয়াদ উত্তীর্ণ নয় এমন ডেটা লোড করুন
      if (data[id].expire && Date.now() > data[id].expire) {
        continue; // মেয়াদ উত্তীর্ণ skip
      }
      global.data.userBanned.set(id, data[id]);
    }

    console.log(`✅ ব্যান ডেটা লোড হয়েছে: ${global.data.userBanned.size} জন`);
  } catch (error) {
    console.error("❌ ব্যান ফাইল লোডে ত্রুটি:", error);
    fs.writeFileSync(BAN_FILE, JSON.stringify({}, null, 2));
  }
}

// =========================
// SAVE BAN DATA
// =========================
function saveBan() {
  try {
    const obj = Object.fromEntries(global.data.userBanned);
    fs.writeFileSync(BAN_FILE, JSON.stringify(obj, null, 2));
    console.log(`💾 ব্যান ডেটা সেভ করা হয়েছে: ${Object.keys(obj).length} জন`);
  } catch (error) {
    console.error("❌ ব্যান ডেটা সেভে ত্রুটি:", error);
  }
}

// =========================
// হেল্পার ফাংশন
// =========================
function getTimeRemaining(expireTime) {
  const now = Date.now();
  const diff = expireTime - now;
  
  if (diff <= 0) return "মেয়াদ শেষ";
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  
  if (days > 0) return `${days}দিন ${hours}ঘন্টা`;
  if (hours > 0) return `${hours}ঘন্টা ${minutes}মিনিট`;
  return `${minutes}মিনিট`;
}

// =========================
// INITIAL LOAD
// =========================
loadBan();

// =========================
// CONFIG
// =========================
module.exports.config = {
  name: "ban",
  version: "4.1.0",
  hasPermssion: 2,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Mirai Stable Ban System with Persistent Storage",
  commandCategory: "group",
  cooldowns: 3
};

// =========================
// HANDLE EVENT (অটো ব্লক)
// =========================
module.exports.handleEvent = async ({ event, api }) => {
  const { senderID, threadID } = event;

  const banData = global.data.userBanned.get(senderID);
  if (!banData) return;

  // মেয়াদ শেষ চেক
  if (banData.expire && Date.now() > banData.expire) {
    // ইউজারের নাম বের করুন
    let userName = banData.userName || "অজানা";
    try {
      const userInfo = await api.getUserInfo(senderID);
      if (userInfo && userInfo[senderID]) {
        userName = userInfo[senderID].name || banData.userName || "অজানা";
      }
    } catch (error) {
      console.error("ইউজারের নাম বের করতে সমস্যা:", error);
    }
    
    global.data.userBanned.delete(senderID);
    saveBan();
    
    return api.sendMessage(
      `🟢 ${userName} এর ব্যান মেয়াদ শেষ হয়েছে!\n✅ এখন থেকে মেসেজ পাঠাতে পারবেন।`,
      threadID
    );
  }

  // ইউজারের নাম বের করুন
  let userName = banData.userName || "অজানা";
  try {
    const userInfo = await api.getUserInfo(senderID);
    if (userInfo && userInfo[senderID]) {
      userName = userInfo[senderID].name || banData.userName || "অজানা";
    }
  } catch (error) {
    console.error("ইউজারের নাম বের করতে সমস্যা:", error);
  }

  // বাকি সময় দেখান
  let timeMsg = "";
  if (banData.expire) {
    const remaining = getTimeRemaining(banData.expire);
    timeMsg = `\n⏳ বাকি: ${remaining}`;
  }

  return api.sendMessage(
    `⛔ ${userName}, আপনি ব্যান করা আছেন!\n📝 কারণ: ${banData.reason}${timeMsg}\n👮 ব্যান করেছেন: ${banData.byName || "অজানা"}`,
    threadID
  );
};

// =========================
// COMMAND
// =========================
module.exports.run = async ({ event, api, args }) => {
  const { threadID, messageID, messageReply, mentions } = event;
  const fullMsg = event.body || "";
  const cmd = fullMsg.split(" ")[0].toLowerCase();

  // =========================
  // টার্গেট আইডি বের করুন
  // =========================
  let targetID = null;
  let startIdx = 1;

  // ১. রিপ্লাই চেক
  if (messageReply) {
    targetID = messageReply.senderID;
    startIdx = 1;
  } 
  // ২. মেনশন চেক
  else if (Object.keys(mentions || {}).length > 0) {
    targetID = Object.keys(mentions)[0];
    startIdx = 1;
  } 
  // ৩. আর্গুমেন্ট থেকে UID বের করুন
  else if (args.length > 0) {
    // চেক করুন args[0] টাইম কিনা
    if (/^(\d+)([mhd])$/.test(args[0])) {
      return api.sendMessage(
        "⚠️ দয়া করে UID দিন অথবা @মেনশন করুন\n\n" +
        "উদাহরণ:\n" +
        "➜ /ban @user 9m স্প্যাম\n" +
        "➜ /ban 123456789 9m স্প্যাম\n" +
        "➜ রিপ্লাই করে /ban 9m কারণ",
        threadID,
        messageID
      );
    } else {
      targetID = args[0];
      startIdx = 2;
    }
  }

  if (!targetID) {
    return api.sendMessage(
      "⚠️ দয়া করে UID দিন / রিপ্লাই দিন / মেনশন করুন",
      threadID,
      messageID
    );
  }

  if (!/^\d+$/.test(targetID)) {
    return api.sendMessage("❌ সঠিক UID দিন (শুধু সংখ্যা)!", threadID, messageID);
  }

  // =========================
  // BAN
  // =========================
  if (cmd === "ban" || cmd === "/ban") {
    // আগে থেকেই ব্যান কিনা চেক
    if (global.data.userBanned.has(targetID)) {
      const existing = global.data.userBanned.get(targetID);
      const timeLeft = existing.expire ? 
        `\n⏳ বাকি: ${getTimeRemaining(existing.expire)}` : 
        "\n♾️ স্থায়ী";
      
      return api.sendMessage(
        `⚠️ ইতিমধ্যেই ব্যান করা!\n📝 কারণ: ${existing.reason}${timeLeft}`,
        threadID,
        messageID
      );
    }

    // ইউজারের নাম বের করুন
    let userName = "অজানা";
    try {
      const userInfo = await api.getUserInfo(targetID);
      if (userInfo && userInfo[targetID]) {
        userName = userInfo[targetID].name || "অজানা";
      }
    } catch (error) {
      console.error("ইউজারের নাম বের করতে সমস্যা:", error);
    }

    // সময় এবং কারণ পার্স
    let time = null;
    let reason = "";
    let expire = null;
    let timeDisplay = "স্থায়ী";

    // চেক করুন args[startIdx] টাইম কিনা
    if (args[startIdx] && /^(\d+)([mhd])$/.test(args[startIdx])) {
      time = args[startIdx];
      const match = time.match(/^(\d+)([mhd])$/);
      const value = parseInt(match[1]);
      const unit = match[2];
      
      if (unit === 'm') {
        expire = Date.now() + (value * 60 * 1000);
        timeDisplay = `${value} মিনিট`;
      } else if (unit === 'h') {
        expire = Date.now() + (value * 60 * 60 * 1000);
        timeDisplay = `${value} ঘন্টা`;
      } else if (unit === 'd') {
        expire = Date.now() + (value * 24 * 60 * 60 * 1000);
        timeDisplay = `${value} দিন`;
      }
      
      reason = args.slice(startIdx + 1).join(" ") || "কারণ উল্লেখ নেই";
    } else {
      reason = args.slice(startIdx).join(" ") || "কারণ উল্লেখ নেই";
    }

    // ব্যান ডেটা সেভ (নাম সহ)
    const banInfo = {
      reason: reason,
      expire: expire,
      by: event.senderID,
      byName: "অজানা",
      time: Date.now(),
      userName: userName
    };

    // ব্যান কার নাম বের করুন
    try {
      const byUserInfo = await api.getUserInfo(event.senderID);
      if (byUserInfo && byUserInfo[event.senderID]) {
        banInfo.byName = byUserInfo[event.senderID].name || "অজানা";
      }
    } catch (error) {
      console.error("ব্যান কার নাম বের করতে সমস্যা:", error);
    }

    global.data.userBanned.set(targetID, banInfo);
    saveBan();

    // রেসপন্স (নাম সহ)
    const endTime = expire ? new Date(expire).toLocaleString('bn-BD') : "স্থায়ী";
    
    return api.sendMessage(
`╔═══════════ BAN ═══════════╗
👤 ইউজার: ${userName}
🆔 UID: ${targetID}
📝 কারণ: ${reason}
⏳ সময়: ${timeDisplay}
📆 শেষ: ${endTime}
👮 ব্যান করেছেন: ${banInfo.byName}
╚════════════════════════════╝`,
      threadID,
      messageID
    );
  }

  // =========================
  // UNBAN
  // =========================
  if (cmd === "unban" || cmd === "/unban") {
    if (!global.data.userBanned.has(targetID)) {
      return api.sendMessage("⚠️ এই ইউজার ব্যান করা নেই", threadID, messageID);
    }

    const banInfo = global.data.userBanned.get(targetID);
    
    // ইউজারের নাম বের করুন
    let userName = banInfo.userName || "অজানা";
    try {
      const userInfo = await api.getUserInfo(targetID);
      if (userInfo && userInfo[targetID]) {
        userName = userInfo[targetID].name || banInfo.userName || "অজানা";
      }
    } catch (error) {
      console.error("ইউজারের নাম বের করতে সমস্যা:", error);
    }
    
    global.data.userBanned.delete(targetID);
    saveBan();

    return api.sendMessage(
`🟢 UNBAN সফল

👤 ইউজার: ${userName}
🆔 UID: ${targetID}
📝 পূর্ববর্তী কারণ: ${banInfo.reason}
⏳ সময়: ${banInfo.expire ? "সীমিত" : "স্থায়ী"} ব্যান ছিল
👮 ব্যান করেছিলেন: ${banInfo.byName || "অজানা"}
✅ এখন আনব্যান করা হয়েছে`,
      threadID,
      messageID
    );
  }

  // =========================
  // BANLIST
  // =========================
  if (cmd === "banlist" || cmd === "/banlist") {
    const bannedUsers = Array.from(global.data.userBanned.entries());
    
    if (bannedUsers.length === 0) {
      return api.sendMessage("📋 কোনো ব্যান করা ইউজার নেই", threadID, messageID);
    }

    let listMessage = "╔══════ BAN LIST ══════╗\n";
    
    for (const [id, data] of bannedUsers) {
      // ইউজারের নাম বের করুন
      let userName = data.userName || "অজানা";
      try {
        const userInfo = await api.getUserInfo(id);
        if (userInfo && userInfo[id]) {
          userName = userInfo[id].name || data.userName || "অজানা";
        }
      } catch (error) {
        console.error("ইউজারের নাম বের করতে সমস্যা:", error);
      }
      
      const timeLeft = data.expire ? 
        `⏳ ${getTimeRemaining(data.expire)}` : 
        "♾️ স্থায়ী";
      
      listMessage += `\n👤 ${userName}\n`;
      listMessage += `   🆔 ${id}\n`;
      listMessage += `   📝 ${data.reason}\n`;
      listMessage += `   ${timeLeft}\n`;
      listMessage += `   👮 ${data.byName || "অজানা"}\n`;
    }
    listMessage += "╚═══════════════════════╝";

    return api.sendMessage(listMessage, threadID, messageID);
  }
};
