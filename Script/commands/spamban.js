const num = 5;
const timeWindow = 60;

module.exports.config = {
  name: "spamban",
  version: "4.1.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "বাংলা স্প্যাম ব্যান সিস্টেম",
  commandCategory: "System",
  cooldowns: 5
};

//
// ✅ বট চালু হলে ব্যান লিস্ট লোড
//
module.exports.onLoad = async function ({ Users }) {
  const allUsers = await Users.getAll();

  for (const user of allUsers) {
    if (user?.data?.banned) {
      global.data.userBanned.set(user.userID, {
        reason: user.data.reason,
        dateAdded: user.data.dateAdded
      });
    }
  }
};

//
// 📌 ইনফো কমান্ড
//
module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
`╔════════════════════╗
║ 🤖 স্প্যাম ব্যান সিস্টেম
╠════════════════════╣
║ 📌 কমান্ড + "bot" detect
║ ⚠️ ৪ বার → সতর্কবার্তা
║ 🚫 ৫ বার → স্থায়ী ব্যান
║ 👑 শুধু বট এডমিন safe
╚════════════════════╝`,
    event.threadID,
    event.messageID
  );
};

//
// 🔥 মেইন সিস্টেম
//
module.exports.handleEvent = async function ({ api, event, Users }) {
  const { senderID, threadID, body } = event;

  if (!body) return;

  // 👑 শুধু BOT ADMIN safe
  const admins = global.config.ADMINBOT || [];
  if (admins.includes(senderID)) return;

  // ❌ আগে থেকেই ব্যান থাকলে কিছু করবে না
  if (global.data?.userBanned?.has(senderID)) return;

  if (!global.client.spamBan) global.client.spamBan = {};

  if (!global.client.spamBan[senderID]) {
    global.client.spamBan[senderID] = {
      count: 0,
      start: Date.now()
    };
  }

  let data = global.client.spamBan[senderID];

  // ⏰ ১ মিনিট পরে রিসেট
  if (Date.now() - data.start > timeWindow * 1000) {
    data.count = 0;
    data.start = Date.now();
  }

  const text = body.toLowerCase();

  const threadData = global.data.threadData.get(threadID) || {};
  const prefix = threadData.PREFIX || global.config.PREFIX;

  const isCommand = text.startsWith(prefix);
  const isBot = /\bbot\b/i.test(text);

  if (!isCommand && !isBot) return;

  data.count++;
  const count = data.count;

  const userData = await Users.getData(senderID);
  const name = userData?.name || "Unknown";

  // ⚠️ সতর্কবার্তা
  if (count === 4) {
    return api.sendMessage(
`╔════════════════╗
║ ⚠️ সতর্কবার্তা
╠════════════════╣
║ 👤 ${name}
║ 📊 ৪/৫
║ ❗ বেশি স্প্যাম করো না
╚════════════════╝`,
      threadID
    );
  }

  // 🚫 ব্যান
  if (count >= num) {
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");

    let user = userData || {};
    user.data = user.data || {};

    const reasonText = `তুমি গুপে SPAM করছো তাই তোমাকে পারমানেন্ট ব্যান করা হয়েছে  তুমি আর বট ব্যাবহার করতে পারবে না ⚠️❌
যুদি বট ব্যাবহার করতে চাও তাহলে আমার বস
乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐ এর ইনবক্সে নক করো বস'কে বলো সে তোমাকে  আনব্যান করে দিবে তার পর তুমি আবার ও বট ব্যাবহার করতে পারবে বস এর আইডি👤➡️ fb.com/mrjuwel999`;

    user.data.banned = true;
    user.data.reason = reasonText;
    user.data.dateAdded = time;

    await Users.setData(senderID, user);

    global.data.userBanned.set(senderID, {
      reason: reasonText,
      dateAdded: time
    });

    global.client.spamBan[senderID] = { count: 0, start: Date.now() };

    api.sendMessage(
`╔════════════════════╗
║ 🚫 ইউজার ব্যান
╠════════════════════╣
║ 👤 নাম: ${name}
║ 🆔 ${senderID}
║ ⏰ সময়: ${time}
╠════════════════════╣
${reasonText}
╚════════════════════╝`,
      threadID
    );

    // 📩 admin notify
    const adminList = global.config.ADMINBOT || [];
    for (const id of adminList) {
      api.sendMessage(
`🚨 AUTO BAN REPORT
👤 ${name}
🆔 ${senderID}
📌 স্প্যাম করেছে
⏰ ${time}`,
        id
      );
    }
  }
};
