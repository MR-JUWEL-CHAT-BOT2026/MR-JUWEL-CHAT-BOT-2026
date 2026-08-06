const request = require("request");
const fs = require("fs-extra");

module.exports.config = {
 name: "owner",
 version: "1.0.1",
 hasPermssion: 0,
 credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
 description: "Display bot owner's information",
 commandCategory: "Info",
 usages: "",
 cooldowns: 5,
 dependencies: {
 request: "",
 "fs-extra": "",
 axios: ""
 }
};

module.exports.run = async function ({ api, event }) {
 const imageUrl = "https://i.imgur.com/iA23wiL.jpeg";
 const path = __dirname + "/cache/owner.png";

 request(imageUrl)
 .pipe(fs.createWriteStream(path))
 .on("close", () => {
 api.sendMessage({
 body:
`🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟

👑 𝗡𝗔𝗠𝗘: 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
😻 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: মেয়েদের মনে🙈
💼 𝗣𝗥𝗢𝗙𝗘𝗦𝗦𝗜𝗢𝗡: মেয়েদের মন জয় করা😍
🌐 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: আইডি বেইচ্চা খাইয়া লাইছি😁
💬 𝗠𝗘𝗦𝗦𝗘𝗡𝗚𝗘𝗥: দিলে Future বউ ধইরা মারব😌
📺 𝗬𝗢𝗨𝗧𝗨𝗕𝗘: কবে YouTubal ছিলাম 😺
📸 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠: গরিব বলে ফেসবুক চালাই শুধু 🥺
📱 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣: দিলে আমার আম্মু বকা দিবা 🤣
🎵 𝗧𝗜𝗞𝗧𝗢𝗞: সরি আমি প্রতিবন্ধী না🥱
👻 𝗦𝗡𝗔𝗣𝗖𝗛𝗔𝗧: তোদের মতো কালা নাকি ফিল্টার লাগামু🤭
😎 𝗦𝗧𝗔𝗧𝗨𝗦: Single but not available 😌
💔 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: হৃদয় এখন অফলাইন
⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚: বেশি মেসেজ দিলে রিপ্লাই পাওয়ার সম্ভাবনা 0.01% 😆
⏰ 𝗔𝗖𝗧𝗜𝗩𝗘: যখন WiFi থাকে তখন 😴
💬 𝗤𝗨𝗢𝗧𝗘: “আমি সিরিয়াস না, কিন্তু ফানি সবসময় 😎”
🏆 𝗥𝗔𝗡𝗞: Local Legend (Village Edition 😂)
🔥 𝗟𝗘𝗩𝗘𝗟: 99% Sarcasm
📵 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣: Seen but ignored 😆
📸 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠: 0 followers, 1000 dreams

━━━━━━━━━━━━━━━━━━━━━━

🤖 𝗕𝗢𝗧 𝗕𝗬: 𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐
`,
 attachment: fs.createReadStream(path)
 }, event.threadID, () => fs.unlinkSync(path));
 });
};
