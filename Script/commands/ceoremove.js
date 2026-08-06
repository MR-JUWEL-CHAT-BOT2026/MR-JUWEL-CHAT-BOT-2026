module.exports.config = {
  name: "ceoremove",
  version: "1.0",
  hasPermssion: 2, // only bot admin
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Remove group admin",
  commandCategory: "admin",
  usages: "[reply/mention/uid]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  // ===== GET TARGET UID =====
  let uid;

  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else if (Object.keys(event.mentions || {}).length > 0) {
    uid = Object.keys(event.mentions)[0];
  } else {
    uid = args[0];
  }

  if (!uid) {
    return api.sendMessage(
`╔════════════════╗
  ⚠️ CEOREMOVE
╚════════════════╝
👉 reply / mention / uid দিতে হবে`,
threadID, messageID);
  }

  try {
    const threadInfo = await api.getThreadInfo(threadID);

    const botID = api.getCurrentUserID();

    const isBotAdmin = threadInfo.adminIDs.some(i => i.id === botID);
    const isUserAdmin = threadInfo.adminIDs.some(i => i.id === uid);

    if (!isBotAdmin) {
      return api.sendMessage(
`╔════════════════╗
  ❌ ERROR
╚════════════════╝
👉 আগে আমাকে এডমিন বানাও`,
threadID, messageID);
    }

    if (!isUserAdmin) {
      return api.sendMessage(
`╔════════════════╗
  ℹ️ INFO
╚════════════════╝
👉 এই ইউজার এডমিন না`,
threadID, messageID);
    }

    await api.changeAdminStatus(threadID, uid, false);

    return api.sendMessage(
`╔════════════════╗
  ✅ SUCCESS
╚════════════════╝
👉 এডমিন রিমুভ করা হয়েছে`,
threadID, messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage(
`╔════════════════╗
  ❌ FAILED
╚════════════════╝
👉 পারমিশন/সিস্টেম সমস্যা`,
threadID, messageID);
  }
};
