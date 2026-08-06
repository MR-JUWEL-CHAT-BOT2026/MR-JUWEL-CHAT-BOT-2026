module.exports.config = {
  name: "autoreact",
  version: "2.0.0",
  hasPermission: 2,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "অটো রিঅ্যাক্ট (বাংলা+ইংরেজি)",
  commandCategory: "No Prefix",
  usages: "[on/off]",
  cooldowns: 0,
};

const fs = require("fs");
const stateFile = __dirname + "/autoreact_state.json";

let autoreactEnabled = true;

// স্টেট লোড/সেভ ফাংশন
function loadState() {
  try {
    if (fs.existsSync(stateFile)) {
      const data = fs.readFileSync(stateFile, "utf8");
      const parsed = JSON.parse(data);
      autoreactEnabled = parsed.enabled !== undefined ? parsed.enabled : true;
    } else {
      fs.writeFileSync(stateFile, JSON.stringify({ enabled: true }), "utf8");
      autoreactEnabled = true;
    }
  } catch (e) {
    autoreactEnabled = true;
  }
}

function saveState(enabled) {
  fs.writeFileSync(stateFile, JSON.stringify({ enabled: enabled }), "utf8");
  autoreactEnabled = enabled;
}

loadState();

module.exports.handleEvent = function({ api, event }) {
  // ফিচার বন্ধ থাকলে বা মেসেজ না থাকলে রিটার্ন
  if (!autoreactEnabled) return;
  if (!event.body) return;
  
  // বট নিজের মেসেজে রিঅ্যাক্ট করবে না
  if (event.senderID === api.getCurrentUserID()) return;

  const msg = event.body.toLowerCase().trim();
  const { messageID } = event;

  // শব্দগুলিকে স্পেস দিয়ে আলাদা করা
  const words = msg.split(/\s+/);
  
  // ---------- রিঅ্যাক্ট লিস্ট (ওয়ার্ড + ইমোজি) ----------
  const reactions = [
    // ১. শুভেচ্ছা / সালাম
    {
      keywords: ["সালাম", "আসসালামু", "ওয়ালাইকুম", "হ্যালো", "হাই", "নমস্কার", "আদাব", "hello", "hi", "salam", "goodmorning", "goodafternoon", "goodevening", "howareyou", "howdy"],
      reaction: "🫡"
    },
    // ২. খাবার / পানীয়
    {
      keywords: ["খিচুরি", "ভাত", "মাছ", "মাংস", "তরকারি", "জল", "পানি", "চা", "কফি", "দুধ", "রুটি", "ডিম", "eat", "food", "rice", "fish", "meat", "curry", "water", "tea", "coffee", "milk", "bread", "egg", "hungry", "lunch", "dinner", "breakfast"],
      reaction: "🍽️"
    },
    // ৩. ভালোবাসা / প্রেম
    {
      keywords: ["ভালোবাসা", "ভালোবাসি", "প্রেম", "লাভ", "মায়া", "আদর", "হৃদয়", "love", "labyu", "ilove", "mahal", "krishna", "ram", "baby", "babe", "kiss", "crush", "kilig"],
      reaction: "🫶"
    },
    // ৪. দুঃখ / কষ্ট
    {
      keywords: ["দুঃখ", "কষ্ট", "ব্যথা", "পেইন", "কান্না", "মৃত্যু", "হতাশা", "ডিপ্রেশন", "sad", "pain", "cry", "depress", "stress", "sakit", "saket", "mamatay"],
      reaction: "🥹"
    },
    // ৫. হাসি / মজা
    {
      keywords: ["হাসি", "মজা", "ঠাট্টা", "পাগল", "laugh", "funny", "lol", "haha", "hehe", "joke", "crazy"],
      reaction: "😂"
    },
    // ৬. আশ্চর্য / অবাক
    {
      keywords: ["অবাক", "আশ্চর্য", "সত্যি", "wow", "really", "seriously"],
      reaction: "😳"
    },
    // ৭. ঘুম / বিশ্রাম
    {
      keywords: ["ঘুম", "ঘুমাও", "বিশ্রাম", "ক্লান্ত", "নিদ্রা", "sleep", "sleepy", "tired", "rest", "goodnight", "night", "nyt"],
      reaction: "😴"
    },
    // ৮. ধন্যবাদ / শুভকামনা
    {
      keywords: ["ধন্যবাদ", "শুকরিয়া", "জাজাকাল্লাহ", "আল্লাহহাফেজ", "বিদায়", "bye", "thank", "thanks", "thankyou", "bless", "goodbye"],
      reaction: "🥰"
    },
    // ৯. রাগ / ক্ষোভ
    {
      keywords: ["রাগ", "ক্ষোভ", "বিরক্ত", "গোস্বা", "চিৎকার", "গালি", "angry", "mad", "upset", "furious", "hate"],
      reaction: "😡"
    },
    // ১০. খেলা / খেলাধুলা
    {
      keywords: ["খেলা", "ফুটবল", "ক্রিকেট", "গোল", "জয়", "পরাজয়", "match", "game", "football", "cricket", "goal", "win", "play", "sport"],
      reaction: "⚽"
    },
    // ১১. গান / সঙ্গীত
    {
      keywords: ["গান", "সঙ্গীত", "বাজনা", "কণ্ঠ", "টিউন", "song", "music", "sing", "melody", "tune"],
      reaction: "🎵"
    },
    // ১২. বই / পড়া
    {
      keywords: ["বই", "পড়া", "শিক্ষা", "বিদ্যালয়", "বিদ্যালয়", "পাঠ", "book", "read", "study", "learn", "knowledge", "class", "exam"],
      reaction: "📖"
    },
    // ১৩. ভ্রমণ / যাত্রা
    {
      keywords: ["ভ্রমণ", "যাত্রা", "ট্রিপ", "পর্যটন", "বেড়ান", "travel", "trip", "journey", "tour", "vacation", "holiday"],
      reaction: "✈️"
    },
    // ১৪. আবহাওয়া / প্রকৃতি
    {
      keywords: ["আবহাওয়া", "বৃষ্টি", "রোদ", "ঠান্ডা", "গরম", "শীত", "গ্রীষ্ম", "বর্ষা", "weather", "rain", "sun", "cold", "hot", "winter", "summer", "autumn"],
      reaction: "🌦️"
    },
    // ১৫. সময় / তারিখ
    {
      keywords: ["সময়", "তারিখ", "কখন", "আজ", "কাল", "পরশু", "time", "date", "when", "today", "tomorrow", "yesterday", "clock"],
      reaction: "⏰"
    },
    // ১৬. চাকরি / অফিস
    {
      keywords: ["চাকরি", "অফিস", "কাজ", "ব্যবসা", "বেকার", "job", "office", "work", "business", "career", "employment"],
      reaction: "💼"
    },
    // ১৭. স্বাস্থ্য / ব্যায়াম
    {
      keywords: ["স্বাস্থ্য", "ব্যায়াম", "ফিট", "সুস্থ", "রোগ", "ওষুধ", "health", "exercise", "fit", "strong", "gym", "medicine"],
      reaction: "💪"
    },
    // ১৮. পরিবার / বন্ধু
    {
      keywords: ["পরিবার", "বন্ধু", "আত্মীয়", "সন্তান", "মা", "বাবা", "ভাই", "বোন", "family", "friend", "relative", "child", "parent", "brother", "sister"],
      reaction: "👨‍👩‍👦"
    },
    // ১৯. অর্থ / টাকা
    {
      keywords: ["টাকা", "অর্থ", "দাম", "ব্যয়", "money", "cash", "price", "cost", "expensive", "cheap", "currency"],
      reaction: "💰"
    },
    // ২০. প্রাণী / পশু
    {
      keywords: ["কুকুর", "বিড়াল", "পাখি", "গরু", "ছাগল", "মাছ", "সাপ", "dog", "cat", "bird", "cow", "goat", "fish", "snake", "animal", "pet"],
      reaction: "🐾"
    }
  ];

  // প্রতিটি শব্দ চেক করা
  for (let word of words) {
    // ইমোজি চেক করা (ইমোজি থাকলে সেটা আলাদা)
    if (word.match(/[\u{1F000}-\u{1FFFF}]/u)) {
      continue; // ইমোজি স্কিপ
    }
    
    for (let item of reactions) {
      if (item.keywords.some(keyword => word === keyword)) {
        // পুরো শব্দ মিললে রিঅ্যাক্ট করবে
        api.setMessageReaction(item.reaction, messageID, (err) => {}, true);
        return; // একটি মেসেজে শুধু প্রথম ম্যাচটাই রিঅ্যাক্ট করবে
      }
    }
  }
  
  // যদি কোনো শব্দ না মেলে, পুরো মেসেজ চেক করা (বাক্যাংশের জন্য)
  for (let item of reactions) {
    if (item.keywords.some(keyword => msg.includes(keyword))) {
      api.setMessageReaction(item.reaction, messageID, (err) => {}, true);
      return;
    }
  }
};

// ------------------- অফ/অন কমান্ড -------------------
module.exports.run = function({ api, event, args }) {
  const { threadID, messageID } = event;

  if (args.length === 0) {
    return api.sendMessage(
      `📌 বর্তমান অবস্থা: ${autoreactEnabled ? "✅ চালু" : "❌ বন্ধ"}\n🔹 ব্যবহার: autoreact on / off`,
      threadID,
      messageID
    );
  }

  const cmd = args[0].toLowerCase();
  if (cmd === "on") {
    if (autoreactEnabled) return api.sendMessage("অটোরিঅ্যাক্ট ইতিমধ্যে চালু আছে।", threadID, messageID);
    saveState(true);
    api.sendMessage("✅ অটোরিঅ্যাক্ট চালু করা হয়েছে।", threadID, messageID);
  } else if (cmd === "off") {
    if (!autoreactEnabled) return api.sendMessage("অটোরিঅ্যাক্ট ইতিমধ্যে বন্ধ আছে।", threadID, messageID);
    saveState(false);
    api.sendMessage("❌ অটোরিঅ্যাক্ট বন্ধ করা হয়েছে।", threadID, messageID);
  } else {
    api.sendMessage("❌ ভুল কমান্ড। ব্যবহার: autoreact on / off", threadID, messageID);
  }
};
