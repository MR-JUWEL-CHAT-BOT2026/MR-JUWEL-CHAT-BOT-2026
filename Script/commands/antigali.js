const fs = require('fs');
const path = __dirname + '/antigaliStatus.json';

let offenseTracker = {};
let settings = {};

function loadSettings() {
  try {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, 'utf8');
      settings = JSON.parse(data);
    } else {
      settings = {};
    }
  } catch (e) {
    settings = {};
  }
}
loadSettings();

function saveSettings() {
  fs.writeFileSync(path, JSON.stringify(settings, null, 2), 'utf8');
}

// ==================== গালি তালিকা (ভাষা অনুযায়ী) ====================
const badWordsEnglish = [
  "fuck", "fucking", "motherfucker", "mother fucker", "fucker", "bollocks", "shit", "asshole", "Sawya", "sawya",
  "tui magi", "idiot", "stupid juwel",
  "bot fuck you", "🖕", "🖕🖕", "🖕🖕🖕", "toke🖕", "toke🖕🖕", "toke 🖕", "🖕 fuck", "fuck 🖕"
];

const badWordsBengali = [
  "আবাল", "সাউয়া", "ভোদা", "মাগি", "চুদি", "বোকাচোদা", "বোকাচুদা", "মাদারচোদ", "চুদা",
  "চুদতে", "সেক্স করতে", "ভোদার গুপ", "সাউয়ার", "খানকি", "পুটকি", "গুদ", "রেন্ডি", "হাত মার",
  "গিটার বাজাও", "হাত মাড়া", "চুদবো", "চুদানির পোলা", "মাং", "মাংগের বেডি", "বালের বট", " তোর বোন এর ভোদা", "তোর বোন এর সাউয়া", "তোর বোন কে চুদি",
  "সাউয়ার বট", "সাউয়ার কথা", "তোর মার ভোদা", "তোর সাউয়া", "তোর মায়ের সাউয়া", "তোর মার সাউয়া", "তোর মার ভোদা",
  "তোর বোনের সাউয়া", "তোর সাউয়া মাগি", "জুয়েল কে চুদি", "জুয়েল চোকাচোদা",
  "এডমিন এর বাল", "চোদার", "তোর মতো মাগি", "তোক চুদি", "তুই ১২ মাগি", "জুয়েল এর মারে চুদি", "জুয়েল এর মাকে চুদি", "জুয়েল এর মার ভোদা", "জুয়েল এর মার সাউয়া",
  "তুই হাত মাড়া মাগি", "তোর মা মাগি", "তোর বোন মাগি", "তোর মাকে চুদি", "তোর বোনকে চুদি", "জুয়েল এর বোন কে চুদি", "জুয়েল এর বোন এর সাউয়া", "জয়েল এর বোন এর ভোদা",
  "মাদারচোদ", "কার বাল", "নিছের বাল", "চোকাচোদা", "রেন্ডির ছেলে", "রেন্ডি মেয়ে",
  "পম্পম", "Pompom", "আবাল নাকি", "জুয়েল বোকাচোদা", "তুই বোকাচোদা", "তুই বুকাচুদা",
  "জাও গিটার বাজাও", "হাত মারবে", "হাত মারবো", "হাত মারো", "হাত মারতে জাবে", "বট এর বসকে চুদি", "বট তোর বসকে চুদি", "বট তোর বস জুয়েল কে চুদি",
  "গিটার বাজাবো", "তুই ১২ ভাতারী মাগি", "তুই হাত মাড়া", "হাত মাড়ি", "জান চুদতে দিবে", "জান চুদতে দিবে", "বট কে চুদি", "বট চুদি", "সাউয়ার বট", "ভোদার বট", "মাংগের বট", "বট তোর বস কে চুদি", "বট তোকে চুদি", "বট তোরে চুদি", "সাউয়ার বট চুদি", "ভোদার বট চুদি",
  "chut", "gand", "bhosdi", "benchod", "madarchod", "randi", "kutta bacsa", "magi", "Magi", "MC Bot", "MC bot", "Mc Bot", "Mc Bot", "Vodar Bot", "Sawyar Bot", "sawyar bot", "Vodar bot", " bot tor booske chudi", "Bot tor boos ke chudi",
  "xodi", "Xodi", "cdi", "Cdi", "Mang", "mang", "tor mar Voda", "tor mare cdi", "Tor mare chodi", "Tor mar voda", "Tor mar Voda", "Tor Bon ar Voda", "Pompom", "chutmarani", " juwek ke cudi", "Juwel ke cdi", "tor boos Juwel ke Chudi",
  "bokacoda", "xodi", "xoda", "cdi", "Bici","boci", "72 Lack", "cudte", " Cudte", "chdi", "chup magi", "Chup magi", "tok chudi", "Tor mar Sawya", "Tor mar Sawya", " Tor bon ar sawya", "Tor Bon ar Sawya", " Sawya dey",
  "tok fuck", "Sawya", "sawya", "Voda", "voda", "Juwel ke chudi", "abal", "vodar group", "Vodar group", "Sawyar group", "nunu", "Nunu", "Tuntuni", "tuntuni", "tor boos ke cudi", "Tor boos ke cudi", "Tor boss ke chudi",
];

// ==================== গালি চেক (কনটেক্সট চেক বাদ) ====================
function checkBadMessage(message) {
  const lower = message.toLowerCase();
  let foundType = null;
  let foundWord = null;

  for (let word of badWordsEnglish) {
    if (lower.includes(word.toLowerCase())) {
      foundType = 'ইংরেজি';
      foundWord = word;
      break;
    }
  }
  if (!foundType) {
    for (let word of badWordsBengali) {
      if (lower.includes(word.toLowerCase())) {
        foundType = 'বাংলা';
        foundWord = word;
        break;
      }
    }
  }

  if (!foundType) return { hasBad: false };

  // কনটেক্সট চেক নেই – সরাসরি গালি হিসেবে ধরা হবে
  return { hasBad: true, type: foundType, word: foundWord };
}

const BOT_ADMINS = ["61591542717221"];

// ==================== কনফিগ ====================
module.exports.config = {
  name: "antigali",
  version: "3.8.2",
  hasPermssion: 0,
  credits: "MR JUWEL (কনটেক্সট চেক বাদ)",
  description: "বাংলা+ইংরেজি Anti-Gali (UI সহ) – কনটেক্সট চেক ছাড়া",
  commandCategory: "moderation",
  usages: "[on/off/status]",
  cooldowns: 0
};

// ==================== ইভেন্ট হ্যান্ডলার ====================
module.exports.handleEvent = async function ({ api, event, Threads }) {
  try {
    if (!event.body) return;
    const threadID = event.threadID;

    // সিস্টেম চালু আছে কিনা
    const isEnabled = settings[threadID] !== undefined ? settings[threadID] : true;
    if (!isEnabled) return;

    const message = event.body;
    const userID = event.senderID;
    if (!userID) return; // সুরক্ষা

    // বটের আইডি বের করা (ফাংশন অথবা প্রপার্টি)
    let botID = null;
    try {
      if (typeof api.getCurrentUserID === 'function') {
        botID = api.getCurrentUserID();
      } else if (api.getCurrentUserID !== undefined) {
        botID = api.getCurrentUserID;
      } else {
        botID = null;
      }
    } catch (e) {
      botID = null;
    }

    // গালি চেক
    const { hasBad, type, word, reason } = checkBadMessage(message);
    if (!hasBad) return;

    // ========== রিঅ্যাক্ট (❌) – আলাদা ট্রাই-ক্যাচ ==========
    if (event.messageID) {
      try {
        await api.setMessageReaction("❌", event.messageID);
      } catch (e) {
        console.warn("Reaction failed:", e.message);
      }
    }

    // ========== অফেন্স ট্র্যাকার ==========
    if (!offenseTracker[threadID]) offenseTracker[threadID] = {};
    if (!offenseTracker[threadID][userID]) {
      offenseTracker[threadID][userID] = { enCount: 0, bnCount: 0, total: 0, lastUpdated: Date.now() };
    }
    let userData = offenseTracker[threadID][userID];

    if (type === 'ইংরেজি') userData.enCount += 1;
    else if (type === 'বাংলা') userData.bnCount += 1;
    userData.total += 1;
    userData.lastUpdated = Date.now();

    const totalCount = userData.total;
    const enCount = userData.enCount;
    const bnCount = userData.bnCount;

    // ========== ইউজার ও গ্রুপ ইনফো (প্যারালেল) ==========
    let userInfo = {};
    let threadInfo = {};
    try {
      const [uInfo, tInfo] = await Promise.all([
        api.getUserInfo(userID).catch(() => ({})),
        api.getThreadInfo(threadID).catch(() => ({}))
      ]);
      userInfo = uInfo;
      threadInfo = tInfo;
    } catch (e) {
      console.error("Info fetch error:", e);
    }

    const userName = userInfo[userID]?.name || "অজানা";
    const groupName = threadInfo.threadName || "Unknown";
    const adminIDs = Array.isArray(threadInfo.adminIDs) ? threadInfo.adminIDs : [];

    const isAdminInThread = (uid) => {
      if (!uid) return false;
      return adminIDs.some(item => {
        const id = typeof item === "string" ? item : item.id;
        return String(id) === String(uid);
      });
    };

    // ========== সতর্কবার্তা ফ্রেম ==========
    const frameBase = (n, extra = '') =>
`╔════════════════════╗
║                                                    
║ ⚠️ সতর্কবার্তা #${n} ⚠️                 
║                                                    
╠═════════════════════╣
║                                                    
║  👤 ব্যবহারকারী : ${userName}                      
║  🆔 ইউজার আইডি  : ${userID}                       
║  🌐 এই বার্তায় ভাষা : ${type}                      
║  📝 শনাক্তকৃত শব্দ : "${word}"                     
║                                                    
║  📊 মোট গালি       : ${totalCount} বার             
║  🇬🇧 ইংরেজি        : ${enCount} বার                
║  🇧🇩 বাংলা         : ${bnCount} বার                
║                                                    
║  ⚠️ আপনার মেসেজে খারাপ কথা পাওয়া গেছে!           
║  📌 দয়া করে আপনার মেসেজটি ডিলিট করুন!            
║  💢 গ্রুপের পরিবেশ নষ্ট করিও না!                  
║                                                    
║  🔁 খারাপ কথা বলেছেন : ${n} বার (এই সেশন)         
║  🚫 ${3 - n} বার বাকি, এরপর কিক!                  
║                                                    
║  ${extra}                                          
║                                                    
╠═══════════════════════╣
║🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      
╚═══════════════════════╝`;

    const alertMsg =
`🚨 অ্যান্টি-গালি অ্যালার্ট 🚨

📌 গ্রুপ: ${groupName}
👤 ব্যবহারকারী: ${userName}
🆔 আইডি: ${userID}
🌐 ভাষা: ${type}
📝 শব্দ: "${word}"
⚠️ সতর্কতা: ${totalCount} (ইংরেজি ${enCount}, বাংলা ${bnCount})
💬 অশালীন বার্তা: "${message}"`;

    // ========== মেসেজ পাঠানো (সতর্কতা ও অ্যালার্ট) ==========
    const sendPromises = [];

    if (totalCount === 1) {
      sendPromises.push(api.sendMessage(frameBase(1, '📌 ১ম সতর্কতা! সাবধান!'), threadID).catch(() => {}));
    } else if (totalCount === 2) {
      sendPromises.push(api.sendMessage(frameBase(2, '⚠️ শেষ সতর্কতা! পরবর্তী বার কিক!'), threadID).catch(() => {}));
    }

    // অ্যাডমিনদের অ্যালার্ট
    for (const admin of adminIDs) {
      const adminID = typeof admin === "string" ? admin : admin.id;
      if (adminID) {
        sendPromises.push(api.sendMessage(alertMsg, adminID).catch(() => {}));
      }
    }
    // বট অ্যাডমিনদের অ্যালার্ট
    for (const ownerID of BOT_ADMINS) {
      sendPromises.push(api.sendMessage(alertMsg, ownerID).catch(() => {}));
    }

    await Promise.allSettled(sendPromises).catch(() => {});

    // ========== মেসেজ ডিলিট (৬০ সেকেন্ড পর) ==========
    if (event.messageID) {
      setTimeout(() => {
        api.unsendMessage(event.messageID).catch(() => {});
      }, 60000);
    }

    // ========== ৩ স্ট্রাইকে কিক ==========
    if (totalCount === 3) {
      const botIsAdmin = botID ? isAdminInThread(botID) : false;

      if (!botIsAdmin) {
        await api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            ⚠️ অপারেশন বন্ধ!                        ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  🤖 বট গ্রুপ অ্যাডমিন নয়!                        ║
║  ❌ তাই কাউকে কিক করা সম্ভব নয়!                  ║
║                                                    ║
║  👤 ${userName}                                   ║
║  🆔 ${userID}                                    ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
          threadID
        ).catch(() => {});
        return;
      }

      if (isAdminInThread(userID)) {
        await api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            ⚠️ অপারেশন বন্ধ!                        ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  👑 এই ব্যবহারকারী গ্রুপ অ্যাডমিন!                ║
║  ❌ তাই তাকে কিক করা সম্ভব নয়!                   ║
║                                                    ║
║  👤 ${userName}                                   ║
║  🆔 ${userID}                                    ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
          threadID
        ).catch(() => {});
        return;
      }

      // কিক করার চেষ্টা
      try {
        await api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            🚫 ইউজার কিক করা হয়েছে!               ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  👤 ${userName}                                   ║
║  🆔 ${userID}                                    ║
║                                                    ║
║  ⚠️ ৩ বার খারাপ কথা ব্যবহার করেছেন!              ║
║  💢 গ্রুপের পরিবেশ নষ্ট করার জন্য কিক!           ║
║  💀 বিদায়! 👋                                    ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
          threadID
        );
        await api.removeUserFromGroup(userID, threadID);
        userData.total = 0; userData.enCount = 0; userData.bnCount = 0;
      } catch (kickErr) {
        // কিক ব্যর্থ হলে কাউন্ট ২-এ নামিয়ে রাখি (পরবর্তী বার আবার চেষ্টা করবে)
        userData.total = 2;
        await api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            ❌ ব্যর্থ হয়েছে!                       ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  ⚠️ ${userName} (${userID})                       ║
║  ➡️ কিক করতে ব্যর্থ!                              ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
          threadID
        ).catch(() => {});
      }
    }

    // ========== ১ ঘন্টা পর রিসেট ==========
    setTimeout(() => {
      if (offenseTracker[threadID] && offenseTracker[threadID][userID]) {
        if (Date.now() - offenseTracker[threadID][userID].lastUpdated > 3600000) {
          offenseTracker[threadID][userID].total = 0;
          offenseTracker[threadID][userID].enCount = 0;
          offenseTracker[threadID][userID].bnCount = 0;
        }
      }
    }, 3600000);

  } catch (error) {
    console.error("❌ AntiGali CRASH:", error);
    // শুধুমাত্র একবার মেসেজ পাঠাব, যাতে বারবার না আসে
    try {
      await api.sendMessage("⚠️ অ্যান্টি-গালি সিস্টেমে ত্রুটি! লগ চেক করুন।", event.threadID);
    } catch (_) {}
  }
};

// ==================== রান কমান্ড ====================
module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const command = args[0] ? args[0].toLowerCase() : null;

  if (!command) {
    const isBotAdmin = BOT_ADMINS.includes(event.senderID);
    const statusText = settings[threadID] !== undefined ? (settings[threadID] ? '✅ চালু' : '❌ বন্ধ') : '✅ চালু (ডিফল্ট)';
    let menu =
`╔══════════════════════════════════════════════════╗
║                                                    ║
║        📋 অ্যান্টি-গালি কন্ট্রোল প্যানেল         ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  📌 বর্তমান স্ট্যাটাস: ${statusText}               ║
║                                                    ║
║  🔹 অপশন সমূহ:                                     ║`;
    if (isBotAdmin) {
      menu += `
║  ➡️ ${module.exports.config.name} on  → চালু      ║
║  ➡️ ${module.exports.config.name} off → বন্ধ      ║`;
    } else {
      menu += `
║  ⚠️ শুধুমাত্র বট অ্যাডমিনরা on/off করতে পারেন     ║`;
    }
    menu += `
║  ➡️ ${module.exports.config.name} status → স্ট্যাটাস ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`;
    return api.sendMessage(menu, threadID);
  }

  if ((command === 'on' || command === 'off') && !BOT_ADMINS.includes(event.senderID)) {
    return api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            ⛔ অ্যাক্সেস অস্বীকৃত!                  ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  ⚠️ শুধুমাত্র বট অ্যাডমিনরা এই কমান্ড ব্যবহার     ║
║     করতে পারেন।                                   ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
      threadID
    );
  }

  if (command === 'on') {
    settings[threadID] = true;
    saveSettings();
    return api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            ✅ সিস্টেম চালু হয়েছে!                 ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  📌 এই গ্রুপে এখন থেকে খারাপ কথা ব্যবহার করলে     ║
║     ব্যবস্থা নেওয়া হবে।                          ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
      threadID
    );
  } else if (command === 'off') {
    settings[threadID] = false;
    saveSettings();
    if (offenseTracker[threadID]) delete offenseTracker[threadID];
    return api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            ❌ সিস্টেম বন্ধ করা হয়েছে!             ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  📌 এই গ্রুপে এখন থেকে কোনো খারাপ কথা চেক করা    ║
║     হবে না।                                       ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
      threadID
    );
  } else if (command === 'status') {
    const status = settings[threadID] !== undefined ? settings[threadID] : true;
    const statusText = status ? '✅ চালু' : '❌ বন্ধ';
    return api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            📊 সিস্টেম স্ট্যাটাস                    ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  🆔 গ্রুপ আইডি : ${threadID}                       ║
║  📌 বর্তমান অবস্থা : ${statusText}                 ║
║                                                    ║
║  📋 কমান্ড সমূহ:                                   ║
║  ➡️ ${module.exports.config.name} on  → চালু      ║
║  ➡️ ${module.exports.config.name} off → বন্ধ      ║
║  ➡️ ${module.exports.config.name} status → স্ট্যাটাস ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
      threadID
    );
  } else {
    return api.sendMessage(
`╔══════════════════════════════════════════════════╗
║                                                    ║
║            ⚠️ ভুল কমান্ড!                          ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║                                                    ║
║  📌 ব্যবহার করুন:                                  ║
║  ${module.exports.config.name} on/off/status       ║
║                                                    ║
╠══════════════════════════════════════════════════╣
║        🛡️ অ্যান্টি-গালি সিস্টেম (৩ স্ট্রাইক)      ║
╚══════════════════════════════════════════════════╝`,
      threadID
    );
  }
};
