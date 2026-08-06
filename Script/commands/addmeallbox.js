module.exports.config = {
name: "admeallbox",
version: "3.0.0",
hasPermssion: 2,
credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
description: "Add Boss To All Groups + Admin Notice",
commandCategory: "Admin",
usages: "admeallbox",
cooldowns: 30
};

module.exports.run = async function ({ api, event, Threads }) {

const targetUID = "61591542717221";

api.sendMessage(
"🔍 | সকল গ্রুপ স্ক্যান করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...",
event.threadID
);

const allThreads = await Threads.getAll();

let added = [];
let pending = [];
let failed = [];

for (const thread of allThreads) {
try {

if (!thread.threadID) continue; const info = await api.getThreadInfo(thread.threadID); if (!info || !info.isGroup) continue; if ( info.participantIDs && info.participantIDs.includes(targetUID) ) continue; try { await api.addUserToGroup( targetUID, thread.threadID ); let mentions = []; let body = 

`╔═『ADMIN ⚠️ NOTICE 』═╗

🙋‍♀️ আমি আমার বস জুয়েলকে এই গ্রুপে এড করছি 👥✅

🫣কোন এডমিন অনলাইন থাকলে আমার জুয়েলকে এপ্রুভ করে গ্রুপে এড করো 🌷🫂🙌

━━━━━━━━━━━━━━━━━━

𝐉𝐔𝐖𝐄𝐋 𝐁𝐎𝐒𝐒 🅐🅡 𝐈'𝐃 👉
fb.com/mrjuwel99

━━━━━━━━━━━━━━━━━━

`;

if (info.adminIDs && info.adminIDs.length > 0) { for (const admin of info.adminIDs) { body += "@Admin "; mentions.push({ tag: "Admin", id: admin.id }); } } body += "\n\n╚════════════════════╝"; try { await api.sendMessage( { body, mentions }, thread.threadID ); } catch (e) {} pending.push( `⏳ ${info.threadName || "Unnamed Group"}` ); } catch (err) { let mentions = []; let body = 

`╔═ADMIN ☠️ NOTICE 📣 ═╗

👑 আমি আমার বস জুয়েল'কে এই গ্রুপে এড করছি।

🧐👀কোন এডমিন অনলাইন থাকলে আমার জুয়েল'কে এপ্রুভ করে গ্রুপে এড করো 😘🫂🫶

━━━━━━━━━━━━━━━━━━

𝐉𝐔𝐖𝐄𝐋 𝐁𝐎𝐒𝐒 🅐🅡 𝐈'𝐃 👉
fb.com/mrjuwel99

━━━━━━━━━━━━━━━━━━

`;

if (info.adminIDs && info.adminIDs.length > 0) { for (const admin of info.adminIDs) { body += "@Admin "; mentions.push({ tag: "Admin", id: admin.id }); } } body += "\n\n╚═══════════════════╝"; try { await api.sendMessage( { body, mentions }, thread.threadID ); pending.push( `⏳ ${info.threadName || "Unnamed Group"}` ); } catch (e) { failed.push( `❌ ${info.threadName || "Unnamed Group"}` ); } } } catch (e) { console.log( "[ADMEALLBOX ERROR]", e ); } 

}

const report =
`╔═══════♻️═══════╗
🌸 𝐀𝐃 𝐌𝐄 𝐀𝐋𝐋 𝐁𝐎𝐗 🌸
╚═══════♻️═══════╝

📊 মোট স্ক্যান করা গ্রুপ:
${allThreads.length}

━━━━━━━━━━━━━━━━━━

⏳ Add / Approval Request পাঠানো হয়েছে:
${pending.length}

${pending.length
? pending.join("\n")
: "কোন গ্রুপ পাওয়া যায়নি"}

━━━━━━━━━━━━━━━━━━

❌ Failed:
${failed.length}

${failed.length
? failed.join("\n")
: "কোন গ্রুপ নেই"}

━━━━━━━━━━━━━━━━━━

👑 Boss UID:
${targetUID}

🤖 System Scan Completed Successfully
`;

return api.sendMessage(
report,
event.threadID
);
};
