const fs = global.nodemodule["fs-extra"];
const path = global.nodemodule["path"];

module.exports.config = {
  name: "autoreplybot",
  version: "6.0.2",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰",
  description: "Auto-response bot with specified triggers",
  commandCategory: "No Prefix",
  usages: "[any trigger]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return; 
  const name = await Users.getNameUser(senderID);
  const msg = body.toLowerCase().trim();

  const responses = {
    "miss you": "অরেক বেডারে Miss না করে xan মেয়ে হলে বস রাহাদ রে হাঙ্গা করো😶👻😘",
    "kiss de": "কিস দিস না তোর মুখে দূর গন্ধ কয়দিন ধরে দাঁত ব্রাশ করিস নাই🤬",
    "👍": "সর এখান থেকে লাইকার আবাল..!🐸🤣👍⛏️",
    "help": "Prefix de sala",
    "hi": "এত হাই-হ্যালো কর ক্যান প্রিও..!😜🫵",
    "fork2": "https://github.com/Rahat-Boss/Rahat_Bot.git",
    "pro": "Khud k0o KYa LeGend SmJhTi Hai 😂",
    "🙄🙄🙄": "🙄🙄🙄",
    "tor ball": "~আজকে ইউটিউব এ দেখলাম বাল দিয়েও কেক বানানো যায়🫠😗",
    "Rahat": "উনি এখন মেয়ে নিয়ে বিজি আছে কি বলবেন আমাকে বলতে পারেন..!🫩🙏",
    "owner": "‎[𝐎𝐖𝐍𝐄𝐑:☞ Rahat Islam☜\nFacebook: https://www.facebook.com/share/17D7Ftj1ri/",
    "admin": "He is Rahat Islam🥶🫢 আইডি বায়োতে আছে 🙂",
    "babi": "এ তো হাছিনা হে মেরে দিলকি দারকান হে মেরি জান হে😍.",
    "chup": "তুই চুপ চুপ কর পাগল ছাগল",
    "assalamualaikum": "وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ 💖",
    "fork": "🔗𝗚𝗶𝘁𝗛𝘂𝗯 𝗙𝗼𝗿𝗸 𝗟𝗶𝗻𝗸:\nhttps://github.com/Xrahat1/Xrahat.git \n\n📹 𝗦𝗲𝘁𝘂𝗽 𝗧𝘂𝘁𝗼𝗿𝗶𝗮𝗹👇🏼\nhttps://youtu.be/QiQG__QRpoM?si=ntXMO3LWxOtM4hF7\n\n🔔𝗨𝗽𝗱𝗮𝘁𝗲 𝗔𝗹𝗹 𝗕𝗼𝘁👇🏿\nhttps://t.me/rahat_bot_community",
    "kiss me": "তুমি পঁচা তোমাকে কিস দিবো না 🤭",
    "thanks": "এতো ধন্যবাদ না দিয়ে আমার বস Rahat রে তোর গার্লফ্রেন্ড টা দিয়ে দে..!🐸🥵",
    "i love you": "মুতার জায়গায় গুতা দেওয়ার ধান্দা😑",
    "by": "কিরে তুই কই যাস কোন মেয়ের সাথে চিপায় যাবি..!🌚🌶️",
    "ami Rahat": "হ্যা বস কেমন আছেন..?☺️",
    "bot er baccha": "আমার বাচ্চা তো তোমার গার্লফ্রেন্ডের পেটে..!!🌚⛏️",
    "tor nam ki": "MY NAME IS  🔰𝗥𝗮𝗵𝗮𝘁_𝗕𝗼𝘁🔰",
    "pic de": "এন থেকে সর দুরে গিয়া মর😒",
    "cudi": "এত চোদা চুদি করস কেনো..!🥱🌝🌚",
    "bal": "বেশি বড়ো হলে কেটে ফেল🫩🫩🙏",
 "শালা আমি রাহাদ": "ভুল হয়ছে বস😩মাফ করে দাও🙏💩",
 "আমি রাহাদ": "আরে বস😮 তুমি এই গ্রুপে কী করো",
 "Rahat ka chudi": "তোর তো নুনুই নাই 🐸😂 চু*বি কীভাবে 💩",
 "Rahat abal": "তোর বাপ আবাল 💩🫦",
 "Khanki": "তোমার চৌদ্দ গুষ্টি 🙃😘",
 "Khanki magi": "তোমার চৌদ্দ গুষ্টি 🙃😘",
 "murgi": "কাউকে murgi দেস না😩মরে যাবো তো🐸",
 "শালা মাফ চা": "🥹বস আমাকে মাফ করে দাও প্লিজ 🙏",
 "তোদের সবাইকে চুদি": "তোর তো নুনুই নাই 🐸😂 চু*বি কীভাবে🐸",
 "Chudi": "তোর তো নুনুই নাই 🐸😂 চু*বি কীভাবে",
 "শালা চুপ কর": "ওকে রাহাদ বস😗",
    "heda": "এতো রাগ শরীরের জন্য ভালো না 😛",
    "boda": "ভাই তুই এত হাসিস না..!🌚🤣",
    "love you": "ভালোবাসা নামক আবলামী করতে চাইলে Rahat boss এর ইনবক্সে গুতা দিন😘",
    "kire ki koros": "তোমার কথা ভাবতে ছি জানু",
    "kire bot": "হ্যাঁ সব কেমন আছেন আপনার ওই খানে উম্মাহ 😘😽🙈"
  };

  if (responses[msg]) {
    return api.sendMessage(responses[msg], threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args, Users }) {
  return this.handleEvent({ api, event, Users });
};