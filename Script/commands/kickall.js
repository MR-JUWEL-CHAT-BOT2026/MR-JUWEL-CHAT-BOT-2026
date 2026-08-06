module.exports.config = {
  name: "kickall",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "MR JUWEL",
  description: "Remove all group members (Only Owner UID)",
  commandCategory: "box chat",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

  // 🔒 Only allowed UID
  const OWNER_UID = "61591542717221";

  // ❌ Block others
  if (event.senderID != OWNER_UID) {
    return api.sendMessage("❌ তুমি এই কমান্ড ব্যবহার করতে পারবে না!", event.threadID, event.messageID);
  }

  try {
    const threadInfo = await api.getThreadInfo(event.threadID);

    const botID = api.getCurrentUserID();

    // ✅ check bot admin
    if (!threadInfo.adminIDs.some(item => item.id == botID)) {
      return api.sendMessage("❌ বটকে আগে গ্রুপ এডমিন বানাও!", event.threadID);
    }

    // 👥 get all members
    let allUsers = threadInfo.participantIDs;

    // ❌ remove bot + owner from list
    let kickList = allUsers.filter(uid => uid != botID && uid != OWNER_UID);

    api.sendMessage("🚨 সব মেম্বার কিক করা শুরু হচ্ছে...", event.threadID);

    for (let id of kickList) {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        api.removeUserFromGroup(id, event.threadID);
      } catch (e) {
        // ignore error
      }
    }

    api.sendMessage("✅ সব মেম্বার কিক সম্পন্ন!", event.threadID);

  } catch (err) {
    api.sendMessage("❌ কোনো সমস্যা হয়েছে!", event.threadID);
  }
};
