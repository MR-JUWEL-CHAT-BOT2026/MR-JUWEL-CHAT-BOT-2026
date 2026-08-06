const fs = require('fs');
const path = __dirname + '/antilinkStatus.json';

let offenseTracker = {};

// 🔥 NEW: pending unsend tracker
let pendingLinks = {};

// ✅ NEW: Allowed Group LINKS (Whitelist)
const ALLOWED_LINKS = [
  "https://m.me/j/AbZku674kk1R55W1/?send_source=gc%3Acopy_invite_link_c",
  "https://m.me/j/AbYIJfbxID4P7lSD/?send_source=gc%3Acopy_invite_link_c",
  "https://m.me/j/AbZBQUk_jHSuVvNt/?send_source=gc%3Acopy_invite_link_c",
  "https://m.me/j/AbbrH-mYmtBGbssc/?send_source=gc%3Acopy_invite_link_c",
  "https://m.me/j/AbavuWvSM1ghwAQk/?send_source=gc%3Asend_in_messenger_c",
  "https://m.me/j/AbYzKB5-82perogW/?send_source=gc%3Acopy_invite_link_c",
  "https://m.me/j/AbYQPkQ1092dfoBy/?send_source=gc%3Acopy_invite_link_c",
  "https://m.me/j/AbbSZCvbQUnNobbY/?send_source=gc%3Acopy_invite_link_c",
  "https://m.me/j/Group666",
  "https://m.me/j/Group777"
];

// সবসময় ON
let antiLinkStatus = true;

// 🔰 Bot Owner / Bot Admin UID list
const BOT_ADMINS = [
  "61591542717221",
];

module.exports.config = {
  name: "antilink",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MR JUWEL",
  description: "Anti Messenger Group Link + Inbox Forward",
  commandCategory: "moderation",
  usages: "",
  cooldowns: 0
};

module.exports.handleEvent = async function({ api, event, Threads }) {
  try {

    if (event.type === "message_unsend") {
      const msgID = event.messageID;
      if (pendingLinks[msgID]) {
        delete pendingLinks[msgID];
        return api.sendMessage(
          "╔═════════════════╗লিংক আনসেন্ড করচিস তাই কিক দিলাম না╚═════════════════╝",
          event.threadID
        );
      }
    }

    if (!antiLinkStatus || !event.body) return;

    const message = event.body;
    const threadID = event.threadID;
    const userID = event.senderID;
    const botID = api.getCurrentUserID && api.getCurrentUserID();

    if (!offenseTracker[threadID]) offenseTracker[threadID] = {};
    if (!offenseTracker[threadID][userID])
      offenseTracker[threadID][userID] = { count: 0, uidSaved: userID };

    // Check for messenger group link
    if (!message.startsWith("https://m.me/j/")) return;

    // 🔥 invite code extract
    const match = message.match(/https:\/\/m\.me\/j\/([A-Za-z0-9_-]+)/);
    let extractedCode = match ? match[1] : null;

    // 🔥 NEW: whitelist check (link দিয়ে)
    const isAllowed = ALLOWED_LINKS.some(link => {
      const m = link.match(/https:\/\/m\.me\/j\/([A-Za-z0-9_-]+)/);
      return m && m[1] === extractedCode;
    });

    if (isAllowed) return;

    let userData = offenseTracker[threadID][userID];
    userData.count += 1;
    const count = userData.count;

    let userInfo = {};
    try { userInfo = await api.getUserInfo(userID); } catch {}
    const userName = userInfo[userID]?.name || "অজানা ব্যবহারকারী";

    let threadInfo = {};
    try {
      if (Threads && typeof Threads.getData === "function") {
        const tdata = await Threads.getData(threadID);
        threadInfo = tdata.threadInfo || {};
      } else if (typeof api.getThreadInfo === "function") {
        threadInfo = await api.getThreadInfo(threadID) || {};
      }
    } catch {}

    const isAdminInThread = (uid) => {
      try {
        if (!threadInfo || !threadInfo.adminIDs) return false;
        return threadInfo.adminIDs.some(item => {
          if (typeof item === "string") return item == String(uid);
          if (item && item.id) return String(item.id) == String(uid);
          return false;
        });
      } catch {
        return false;
      }
    };

    const groupName = threadInfo.threadName || "Unknown Group";

    const alertMsg =
`🚨 Anti-Link Alert
👥 গ্রুপ: ${groupName}
👤 ইউজার: ${userName}
🆔 UID: ${userID}
💬 লিঙ্ক:
"${event.body}"`;

    for (const ownerID of BOT_ADMINS) {
      try {
        await api.sendMessage(alertMsg, ownerID);
      } catch {}
    }

    const frameMsg =
`╔═══════════════╗
#${count}  ${userName} (UID: ${userID})

😡 এ আবাল তুই জানিস না এডমিন এর পারমিস ছারা গুপে লিঙ্ক দেওয়া নিষেদ🚫😡

⚠️15 সেকেন্ড এর মধ্য লিঙ্ক রিমুভ কর না করলে কিক খাবি 😡🚫
╚═════════════════╝`;

    await api.sendMessage(frameMsg, threadID);

    pendingLinks[event.messageID] = true;

    setTimeout(async () => {

      if (!pendingLinks[event.messageID]) return;

      const botIsAdmin = botID ? isAdminInThread(botID) : false;

      if (!botIsAdmin) {
        return api.sendMessage(
`╔═════════════════════╗
⚠️ কাজটি বন্ধ করা হয়েছে
🤖 আমি (বট) অ্যাডমিন নই
👤 ${userName} (UID: ${userID})
╚══════════════════════╝`,
          threadID
        );
      }

      if (isAdminInThread(userID)) {
        return api.sendMessage(
`╔════════════════════════╗
⚠️ কিক দেওয়া বন্ধ করা হয়েছে
এই ব্যবহারকারী একজন গ্রুপ অ্যাডমিন
👤 ${userName} (UID: ${userID})
╚═════════════════════════╝`,
          threadID
        );
      }

      try {
        await api.sendMessage(
`╔═════════════════╗
${userName} (UID: ${userID}) 

⚠️🚫লিঙ্ক রিমুভ করতে বলচি করস নাই তাই তোকে কিক দেওয়া হলো বোকাচুদা🥵
╚═════════════════╝`,
          threadID
        );

        await api.removeUserFromGroup(userID, threadID);
        userData.count = 0;

        delete pendingLinks[event.messageID];

      } catch {
        userData.count = 0;
        await api.sendMessage(
`⚠️ ${userName} (${userID})-কে কিক করতে ব্যর্থ।`,
          threadID
        );
      }

    }, 15000);

  } catch (error) {
    console.error("AntiLink error:", error);
    api.sendMessage("⚠️ Anti-Link সিস্টেমে একটি ত্রুটি ঘটেছে।", event.threadID);
  }
};

module.exports.run = async function () {};
