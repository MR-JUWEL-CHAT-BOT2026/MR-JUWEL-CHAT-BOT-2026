module.exports.config = {
  name: "roast",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "ফানি roast করে ইউজারকে মজা দেয়",
  commandCategory: "fun",
  usages: "roast",
  cooldowns: 5
};

const roasts = [
"তুমি এত ধীরে কাজ করো...\nঘড়িও তোমার জন্য অপেক্ষা করে 😆",

"তোমার স্মার্টনেস দেখে\nCalculator-ও লজ্জা পায় 🤣",

"তুমি অনলাইনে থাকো ঠিকই...\nকিন্তু রিপ্লাই আসে পরের জন্মে 😭",

"তুমি এত ভুলে যাও...\nGoogle-ও তোমাকে ব্লক করতে চায় 💀",

"তোমার WiFi থেকেও ধীর\nতোমার লজিক 🤡",

"তুমি পড়াশোনা করো নাকি\nবই তোমাকে পড়ে বুঝে না 😆",

"তোমার মুড সুইং এত ফাস্ট\nRoller coaster-ও হার মানে 🎢",

"তুমি গেম খেলো?\nনা গেম তোমাকে খেলায় 🤣",

"তুমি রান্না করো?\nSmoke alarm তোমার ফ্যান ক্লাব 😭",

"তোমার আইডিয়া শুনে\nBrain নিজেই অফলাইন হয়ে যায় 💀",

"তুমি লেট আসো এত\nTime zone-ও কনফিউজড 😆",

"তুমি এত অলস\nShadow-ও তোমাকে ফলো করে না 🤡",

"তুমি স্মার্ট নাকি...\nError 404: Not Found 💻",

"তুমি কথা বললে\nAuto-skip বাটন দরকার হয় 🤣",

"তুমি ফাস্ট বলো?\nLoading screen হাসে 😭",

"তুমি পড়াশোনা করো...\nকিন্তু syllabus কাঁদে 💀",

"তুমি জিনিয়াস?\nGoogle বলল 'No comments' 😆",

"তোমার প্ল্যান শুনে\nUniverse রিস্টার্ট নিতে চায় 🤣",

"তুমি এত স্লো...\nSnail-ও তোমাকে ওভারটেক করে 🐌",

"তুমি হাসো...\nকিন্তু কারণ কেউ খুঁজে পায় না 😭"
];

module.exports.run = async function({ api, event }) {
  const msg = roasts[Math.floor(Math.random() * roasts.length)];
  return api.sendMessage("🔥 Roast:\n\n" + msg, event.threadID, event.messageID);
};
