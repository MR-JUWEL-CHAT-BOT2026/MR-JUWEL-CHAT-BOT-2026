module.exports.config = {
    name: "inbox",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
    description: "Send inbox message to user",
    commandCategory: "system",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
    const uid = String(event.senderID);

    try {
        const name = await Users.getNameUser(uid);

        const inboxMsg = `
╔══════════════════════╗
║      💌 𝗜𝗡𝗕𝗢𝗧 𝗜𝗩𝗚 𝗧𝗖𝗥 💌      ║
╚══════════════════════╝

🌸 𝐇𝐞𝐥𝐥𝐨 ${name}!

আপনার অনুরোধ সফলভাবে গ্রহণ করা হয়েছে। ❤️

🤖 Bot আপনার সাথে সংযুক্ত হয়েছে।
📩 আপনার মেসেজ আমাদের কাছে পৌঁছেছে।

━━━━━━━━━━━━━━━━━━

✨ 𝗥𝗜𝗬𝗔 𝗥𝗘𝗔𝗖𝗧𝗜𝗨𝗧𝗥𝗛𝗢𝗥 ✨

💖 ধন্যবাদ আমাদের সেবা ব্যবহার করার জন্য।

━━━━━━━━━━━━━━━━━━

📌 তথ্য:

➤ এই বটের সাথে যোগাযোগ করতে চাইলে
   সরাসরি ইনবক্সে মেসেজ করুন।

➤ আপনার কোনো সমস্যা থাকলে
   Owner-এর সাথে যোগাযোগ করুন।

━━━━━━━━━━━━━━━━━━

👑 Owner :
乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐

╔══════════════════════╗
║ ❤️ 𝗛𝗔𝗗𝗙𝗕 𝗦𝗖𝗤 𝗧𝗙 ❤️ ║
╚══════════════════════╝
`;

        await api.sendMessage(inboxMsg, uid);

        return api.sendMessage(
`╔══════════════╗
║ ✅ 𝗦𝗨𝗨𝗥𝗦𝗛 ║
╚══════════════╝

📩 ${name}, আপনার Inbox-এ একটি মেসেজ পাঠানো হয়েছে।

💌 Messenger Inbox চেক করুন।

━━━━━━━━━━━━━━━━━━
🤖 Riya Reactivated
━━━━━━━━━━━━━━━━━━`,
            event.threadID,
            event.messageID
        );

    } catch (e) {
        console.log("Inbox Command Error:", e);

        return api.sendMessage(
`╔══════════════╗
║ ❌ 𝗗𝗔𝗗𝗙𝗧 ║
╚══════════════╝

ইনবক্সে মেসেজ পাঠানো সম্ভব হয়নি।

📛 Error: ${e.message || e}

সম্ভাব্য কারণ:
• User-এর সাথে বটের পূর্বে চ্যাট নেই।
• Messenger Restriction আছে।
• Bot-এর Appstate/Cookies Expired।
• Facebook API Error হয়েছে।`,
            event.threadID,
            event.messageID
        );
    }
};
