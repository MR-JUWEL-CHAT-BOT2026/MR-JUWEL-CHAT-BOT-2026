module.exports.config = {
  name: "prefix",
  version: "1.0.0", 
  hasPermssion: 0,
  credits: "MR JUWEL",
  description: "Display the bot's prefix and owner info",
  commandCategory: "Information",
  usages: "",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body } = event;
  if (!body) return;

  var dataThread = await Threads.getData(threadID);
  var data = dataThread.data || {};
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const groupName = dataThread.threadInfo?.threadName || "Unnamed Group";

  const triggerWords = [
    "prefix", "mprefix", "mpre", "bot prefix", "what is the prefix", "bot name",
    "how to use bot", "bot not working", "bot is offline", "prefx", "prfix",
    "perfix", "bot not talking", "where is bot", "bot dead", "bots dead",
    "dấu lệnh", "daulenh", "what prefix", "freefix", "what is bot", "what prefix bot",
    "how use bot", "where are the bots", "where prefix"
  ];

  let lowerBody = body.toLowerCase();
  if (triggerWords.includes(lowerBody)) {

    // 🔥 AUTO REACT
    api.setMessageReaction("💖", messageID, () => {}, true);

    return api.sendMessage(
`╔═─━⌬PREFIX SYSTEM⌬━━═╗
║
║  ✦ 『 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 』
║  ━━━━━━━━━━━━━━━
║  ➤ ✅ Prefix : 『 ${prefix} 』
║  ➤ 🤖 Name   : ⎯꯭𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐
║  ➤ 👑 Admin  : 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
║
║  ✦ 『 𝐁𝐎𝐗 𝐈𝐍𝐅𝐎 』
║  ━━━━━━━━━━━━━━━
║  ➤ 📌 Box Prefix : ${prefix}
║  ➤ 🏷️ Name       : ${groupName}
║  ➤ 🆔 Thread ID  : ${threadID}
║
║  ✦ 『 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 』
║  ━━━━━━━━━━━━━━━
║  ➤ 👤 Name : 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
║  ➤ 🌐 FB   : fb.com/mrjuwe99
║  ➤ 💬 MSG  : mrjuwel99
║  ➤ 📱 WA   : +8801943488192
║
╠═━⌬THANK YOU⌬━═╣
║Thanks for using RIYA BOT ✨
╚═━━⌬POWERED BY MR JUWEL⌬━
━═╝`,
      threadID,
      null
    );
  }
};

module.exports.run = async ({ event, api }) => {
  return api.sendMessage("Type 'prefix' or similar to get the bot info.", event.threadID);
};
