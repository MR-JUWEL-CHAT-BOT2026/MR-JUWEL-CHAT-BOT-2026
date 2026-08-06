const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "setpp",
  version: "1.2.0",
  hasPermssion: 2,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Reply to an image and set bot profile picture",
  commandCategory: "admin",
  usages: "Reply photo",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  try {

    // Bot Admin Only
    if (!global.config.ADMINBOT.includes(event.senderID)) {
      return api.sendMessage(
        "❌ এই কমান্ড শুধুমাত্র Bot Admin ব্যবহার করতে পারবে।",
        event.threadID,
        event.messageID
      );
    }

    const reply = event.messageReply;

    if (!reply || !reply.attachments || reply.attachments.length === 0) {
      return api.sendMessage(
        "❌ কোনো ছবিতে রিপ্লাই করে setpp কমান্ড দিন।",
        event.threadID,
        event.messageID
      );
    }

    const attachment = reply.attachments[0];

    if (attachment.type !== "photo") {
      return api.sendMessage(
        "❌ শুধু ছবিতে রিপ্লাই করুন।",
        event.threadID,
        event.messageID
      );
    }

    // 🌸 Loading Message
    const loading = await api.sendMessage(
`╭━━━━━━━━━━━━━━╮
┃ 🌸 একটু অপেক্ষা করো বেবি...
┃ ⏳ কাজ শুরু হচ্ছে...
╰━━━━━━━━━━━━━━╯`,
      event.threadID
    );

    // 🔄 Loading Animation
    setTimeout(() => {
      api.editMessage(
`╭━━━━━━━━━━━━━━╮
┃ 📥 ছবি ডাউনলোড করা হচ্ছে...
┃ ▰▱▱▱▱▱▱▱▱ ২০%
╰━━━━━━━━━━━━━━╯`,
        loading.messageID
      );
    }, 1000);

    setTimeout(() => {
      api.editMessage(
`╭━━━━━━━━━━━━━━╮
┃ 🔍 ছবি যাচাই করা হচ্ছে...
┃ ▰▰▰▱▱▱▱▱▱ ৪০%
╰━━━━━━━━━━━━━━╯`,
        loading.messageID
      );
    }, 2000);

    setTimeout(() => {
      api.editMessage(
`╭━━━━━━━━━━━━━━╮
┃ 🎨 নতুন রূপ তৈরি হচ্ছে...
┃ ▰▰▰▰▰▰▱▱▱ ৭০%
╰━━━━━━━━━━━━━━╯`,
        loading.messageID
      );
    }, 3000);

    setTimeout(() => {
      api.editMessage(
`╭━━━━━━━━━━━━━━╮
┃ 🚀 প্রোফাইল পিকচার সেট করা হচ্ছে...
┃ ▰▰▰▰▰▰▰▰▱ ৯০%
╰━━━━━━━━━━━━━━╯`,
        loading.messageID
      );
    }, 4000);

    setTimeout(() => {
      api.editMessage(
`╭━━━━━━━━━━━━━━╮
┃ ✅ কাজ সম্পন্ন হয়েছে!
┃ ▰▰▰▰▰▰▰▰▰ ১০০%
╰━━━━━━━━━━━━━━╯`,
        loading.messageID
      );
    }, 5000);

    // 📥 Download Image
    const imgPath = path.join(
      __dirname,
      "cache",
      `avatar_${Date.now()}.jpg`
    );

    const response = await axios({
      url: attachment.url,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(imgPath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      try {
        // একটু অপেক্ষা, যাতে লোডিং শেষ হয়
        setTimeout(async () => {
          await api.changeAvatar(fs.createReadStream(imgPath));

          fs.unlinkSync(imgPath);

          // 🔔 আলাদা নোটিশ
          api.sendMessage(
`╔════════════════════╗
║    🖼️ ফটো চেঞ্জ নোটিশ
╠════════════════════╣
║ 🤖বট এর নতুন প্রোফাইল ছবি🖼️
║ সফলভাবে🔄পরিবর্তন করা হয়েছে✅
╚════════════════════╝`,
            event.threadID,
            event.messageID
          );
        }, 5500);

      } catch (e) {
        console.log(e);

        api.sendMessage(
`╔════════════════════╗
║      ❌ ব্যর্থ হয়েছে
╠════════════════════╣
║ ⚠️ changeAvatar সাপোর্ট নেই
║ 🔧 FCA/Mirai আপডেট করুন
╚════════════════════╝`,
          event.threadID,
          event.messageID
        );
      }
    });

    writer.on("error", (err) => {
      console.log(err);

      api.sendMessage(
`╔════════════════════╗
║      ❌ ত্রুটি হয়েছে
╠════════════════════╣
║ 📥 ছবি ডাউনলোড করা যায়নি
╚════════════════════╝`,
        event.threadID,
        event.messageID
      );
    });

  } catch (err) {
    console.log(err);

    api.sendMessage(
`╔════════════════════╗
║      ❌ ত্রুটি হয়েছে
╠════════════════════╣
║ ⚠️ আবার চেষ্টা করুন
╚════════════════════╝`,
      event.threadID,
      event.messageID
    );
  }
};
