module.exports.config = {
  name: "setaddabox",
  version: "1.0.1",
  hasPermssion: 1,
  credits: "MR JUWEL",
  description: "Set group name",
  commandCategory: "Box Chat",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {

  const allowedUID = "100071528325738";

  if (event.senderID !== allowedUID) {
    return api.sendMessage("⛔ তুমি এই কমান্ড ব্যবহার করতে পারবে না!", event.threadID, event.messageID);
  }

  const groupName = "ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿𝐁🅗𝐀𝐋🅞𝐁𝐀🅢𝐀ꜛ⁽🆁₎🎀⃞⃟ꕥ̳̳̳̳̳̳̳̿̿̿̿̿⤹𝐑𝐀🅙𝐌𝐀🅗𝐀𝐋⤸⃞ꕥ̳̳̳̳̳̳̳̿̿̿̿̿🩷ꤪ𝐅𝐀🅜𝐈𝐋𝐘 ─⃞⤹😽ꤪ𝐆𝐑🅞𝐔𝐏⤸⃞🩷ꤪ🪽ꜛ國࿐";

  try {
    // main method
    await api.setTitle(groupName, event.threadID);

    // fallback (কিছু bot এ লাগে)
    if (api.changeThreadName) {
      await api.changeThreadName(groupName, event.threadID);
    }

    return api.sendMessage("✅ গ্রুপ নাম সফলভাবে সেট করা হয়েছে!", event.threadID, event.messageID);

  } catch (e) {
    console.log(e);
    return api.sendMessage("❌ নাম সেট করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
