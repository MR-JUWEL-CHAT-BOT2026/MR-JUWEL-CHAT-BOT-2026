module.exports.config = {
  name: "restart",
  version: "1.5.0",
  hasPermssion: 0,
  credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
  description: "Fast restart system ⚡",
  commandCategory: "Admin",
  usages: "restart",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;
  
  // শুধুমাত্র এই ইউজার আইডি চালাতে পারবে
  const allowedUser = "61591542717221";
  
  if (senderID !== allowedUser) {
    return api.sendMessage(
      "❌ আপনাকে এই কমান্ড ব্যবহার করার অনুমতি দেওয়া হয়নি! শুধুমাত্র বটের মালিক এই কমান্ড চালাতে পারবেন।",
      threadID,
      messageID
    );
  }

  // রিস্টার্ট মেসেজ পাঠান
  await api.sendMessage(
`╔════════════════════╗
   🔄 𝗦𝗬𝗦𝗧𝗘𝗠 𝗥𝗘𝗦𝗧𝗔𝗥𝗧
╚════════════════════╝

⏳ 𝗕𝗢𝗧 𝗜𝗦 𝗥𝗘𝗦𝗧𝗔𝗥𝗧𝗜𝗡𝗚...
⚡ 𝗣𝗟𝗘𝗔𝗦𝗘 𝗪𝗔𝗜𝗧 𝗔 𝗠𝗢𝗠𝗘𝗡𝗧

━━━━━━━━━━━━━━━━━━`,
    threadID,
    messageID
  );

  // সরাসরি রিস্টার্ট করুন (কোনো লোডশেডিং/এনিমেশন ছাড়া)
  setTimeout(() => {
    process.exit(2); // বট রিস্টার্ট করুন
  }, 1000);
};
