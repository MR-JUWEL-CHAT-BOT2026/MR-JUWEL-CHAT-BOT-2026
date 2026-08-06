const moment = require("moment-timezone");

module.exports.config = {
    name: "autoban",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "অপমানজনক শব্দ স্বয়ংক্রিয়ভাবে সনাক্ত করে ব্যান করে",
    commandCategory: "system",
    usages: "",
    cooldowns: 0
};

// ================== শব্দের তালিকা (বাংলা + ইংরেজি) ==================
const badWords = [
    // বাংলা গালি
    "বট এমসি", "এমসি বট", "চুতিয়া বট", "বিএসডিকে বট", "বট তোর মায়ের চুদ", "ঝাটু বট", "ভোদার বট", "স্টুপিড বটস", "চাপড়ি বট", "বট লুন্ড", "জুয়েল এমসি", "এমসি জুয়েল", "বালের বট জুয়েল কে", "সাউয়ার বট", "এটা বট ভালো না", "ভালো না এটা বট", "পাগল বট", "বট পাগল হইছে", "বালের বট", "বালের বট কে এড করছে", "কেউ বট কে এড করবে না", "তোর বস বোকাচোদা", "বট তোর জুয়েল কে চুদি", "বট চুদি", "ক্রেজি বটস", "বিসি বট", "পাগল বট", "বট খুং", "হেড়ার বট", "বালের জুয়েল", "তোর জুয়েল বস কে চুদি", "লুচ্চা বট", "বট তোকে চুদি", "বট এনসিসি", "বট ওসি", "বট ওস", "বট ওসি চো", "সিসি বট", "বট টিকি", "লোজ বট", "লোল বট", "লোজ বট", "লোন বট", "বোডার বট", "মাং এর বট", "বট ক্যাক", "সাওয়ার বট", "বট সোদি", "বট সুদি", "সাউয়ার বট", "বট সিদা", "বালের বট এড করছে", "বট কোড", "বট শপি", "ব্যাড বটস", "বট কাউ",
    
    // ইংরেজি গালি
    "bot mc", "mc bot", "chutiya bot", "bsdk bot", "bot teri maa ki chut", "jhatu bot", "stupid bots", "chapri bot", "bot lund", "juwel mc", "mc juwel", "crazy bots", "bc bot", "bot khung", "bot ncc", "bot oc", "bot oc cho", "cc bot", "bot tiki", "lozz bot", "lol bot", "loz bot", "lon bot", "boder bot", "bot cac", "bot xodi", "bot sudi", "bot sida", "bot code", "bot shoppee", "bad bots", "bot cau",
    
    // মিক্সড (বাংলা + ইংরেজি)
    "fuck bot", "bot fuck", "motherfucker bot", "bot motherfucker", "asshole bot", "bot asshole", "bastard bot", "bot bastard", "dumb bot", "bot dumb", "idiot bot", "bot idiot", "retard bot", "bot retard", "shit bot", "bot shit", "bullshit bot", "bot bullshit"
];

// ================== ইভেন্ট হ্যান্ডলার ==================
module.exports.handleEvent = async ({ event, api, Users, Threads }) => {
    const { threadID, messageID, body, senderID } = event;

    if (!body || senderID == api.getCurrentUserID()) return;

    const msg = body.toLowerCase().trim();
    const time = moment().tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");
    const name = await Users.getNameUser(senderID);
    
    // থ্রেডের নাম পাওয়া
    let threadName = "ব্যক্তিগত চ্যাট";
    try {
        const threadInfo = await Threads.getInfo(threadID);
        threadName = threadInfo.threadName || threadName;
    } catch (e) {}

    // অপমানজনক শব্দ চেক করা
    const matchedWords = badWords.filter(word => msg === word || msg.includes(word));
    
    if (matchedWords.length === 0) return;

    // ================== আপডেটেড সতর্কতা বার্তা ==================
    const warning = {
        body:
`╔══════════════════════╗
║   🚫 অটো ব্যান সিস্টেম   ║
╚══════════════════════╝

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

👤 ব্যবহারকারী: ${name}
🆔 ইউজার আইডি: ${senderID}
💬 গ্রুপ: ${threadName}
⚠️ কারণ: অপমানজনক ভাষা ব্যবহার
🔍 শনাক্তকৃত শব্দ: ${matchedWords.join(', ')}

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

❌ আপনাকে সিস্টেম থেকে ব্যান করা হয়েছে
⏰ সময়: ${time}

📌 নিয়ম মনে রাখবেন:
• অপমানজনক ভাষা ব্যবহার নিষিদ্ধ
• বটের প্রতি সম্মান দেখান
• গ্রুপের নিয়ম মেনে চলুন

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰
🛡️ নিরাপদ পরিবেশ বজায় রাখুন 🛡️`
    };

    // ================== ব্যান প্রক্রিয়া ==================
    const userData = await Users.getData(senderID) || {};
    userData.banned = true;
    userData.reason = `অপমানজনক ভাষা ব্যবহার: ${matchedWords.join(', ')}`;
    userData.dateAdded = time;
    userData.threadID = threadID;
    userData.threadName = threadName;

    global.data.userBanned.set(senderID, {
        reason: userData.reason,
        dateAdded: time,
        threadID: threadID,
        threadName: threadName
    });

    await Users.setData(senderID, { data: userData });

    // সতর্কতা পাঠানো
    api.sendMessage(warning, threadID, messageID);

    // ================== আপডেটেড অ্যাডমিন নোটিফিকেশন ==================
    const adminIDs = global.config.ADMINBOT || [];
    for (const admin of adminIDs) {
        api.sendMessage(
`╔════════════════════════════╗
║    🚨 অ্যাডমিন সতর্কতা 🚨    ║
╚════════════════════════════╝

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

📋 ব্যান রিপোর্ট:

👤 নাম: ${name}
🆔 আইডি: ${senderID}
💬 গ্রুপ: ${threadName}
🆔 গ্রুপ আইডি: ${threadID}

⚠️ কার্যক্রম: স্বয়ংক্রিয় ব্যান
📌 কারণ: ${matchedWords.join(', ')}
⏰ সময়: ${time}

📊 পরিসংখ্যান:
• মোট শব্দ সনাক্ত: ${matchedWords.length}
• শব্দের ধরন: বাংলা/ইংরেজি/মিক্সড

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

⚡ দ্রুত ব্যবস্থা নিন প্রয়োজনে ⚡`,
        admin
        );
    }

    // ================== গ্রুপের অন্য সদস্যদের নোটিফিকেশন ==================
    api.sendMessage(
`⚠️ গ্রুপ নোটিফিকেশন ⚠️

${name} কে অপমানজনক ভাষা ব্যবহারের কারণে স্বয়ংক্রিয়ভাবে ব্যান করা হয়েছে।

🔍 সনাক্তকৃত শব্দ: ${matchedWords.join(', ')}

🙏 দয়া করে সবাই গ্রুপের নিয়ম মেনে চলুন।`,
    threadID
    );
};

// ================== কমান্ড রান ==================
module.exports.run = async ({ event, api }) => {
    return api.sendMessage(
`╔════════════════════════╗
║   🤖 অটো ব্যান সিস্টেম   ║
╚════════════════════════╝

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

✅ সিস্টেম স্ট্যাটাস:

✔️ মনিটরিং: সক্রিয়
✔️ অটো ব্যান: চালু
✔️ অ্যাডমিন সুরক্ষা: সক্রিয়
✔️ শব্দ ডেটাবেস: আপডেটেড

📊 পরিসংখ্যান:
• বাংলা শব্দ: ৫০+ 
• ইংরেজি শব্দ: ৪০+
• মিক্সড শব্দ: ২০+

▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰

⚡ বট নিরাপদে চলছে ⚡`,
        event.threadID
    );
};
