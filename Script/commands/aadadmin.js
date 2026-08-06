const fs = require("fs");
const path = require("path");

module.exports.config = {
 name: "addadmin",
 version: "4.0.0",
 hasPermssion: 2,
 credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
 description: "বাংলা Ultimate Admin System (Add + Protect + Temp + Log)",
 commandCategory: "group",
 usages: "reply / @mention / UID / সময়",
 cooldowns: 5
};

// 📁 ডাটা ফাইল
const dataPath = path.join(__dirname, "adminData.json");

// 📥 ডাটা লোড
function loadData() {
 if (!fs.existsSync(dataPath)) return {};
 return JSON.parse(fs.readFileSync(dataPath));
}

// 💾 ডাটা সেভ
function saveData(data) {
 fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports.run = async function ({ api, event, args, Users }) {
 const { threadID, messageID, mentions, messageReply } = event;
 const threadInfo = await api.getThreadInfo(threadID);
 const botID = api.getCurrentUserID();

 const data = loadData();
 if (!data[threadID]) data[threadID] = { owners: [], temps: {} };

 // ❌ বট admin না হলে
 if (!threadInfo.adminIDs.some(i => i.id == botID)) {
 return api.sendMessage(
`╔════════════════════╗
 ❌ 𝗘𝗥𝗥𝗢𝗥
╚════════════════════╝

🤖 আমি এই গ্রুপে Admin না!
👉 আগে আমাকে Admin বানাও`,
 threadID, messageID
 );
 }

 let targetID;
 let time = parseInt(args[1]);

 // 🎯 ইউজার সিলেক্ট
 if (messageReply) targetID = messageReply.senderID;
 else if (Object.keys(mentions).length > 0) targetID = Object.keys(mentions)[0];
 else if (args[0]) targetID = args[0];
 else {
 return api.sendMessage(
`╔════════════════════╗
 ⚠️ ইউজার পাওয়া যায়নি
╚════════════════════╝

📌 কাউকে Reply / Mention / UID দাও`,
 threadID, messageID
 );
 }

 try {
 // ⚠️ Already admin
 if (threadInfo.adminIDs.some(i => i.id == targetID)) {
 return api.sendMessage(
`╔════════════════════╗
 ⚠️ আগে থেকেই Admin
╚════════════════════╝

👤 এই ইউজার আগে থেকেই Admin আছে`,
 threadID, messageID
 );
 }

 // 🚀 Admin বানানো
 await api.changeAdminStatus(threadID, targetID, true);

 const name = await Users.getNameUser(targetID);

 // 🔒 Owner save
 if (!data[threadID].owners.includes(targetID)) {
 data[threadID].owners.push(targetID);
 }

 // ⏱️ Temporary admin
 if (!isNaN(time)) {
 const expire = Date.now() + time * 60 * 60 * 1000;
 data[threadID].temps[targetID] = expire;

 setTimeout(async () => {
 try {
 const newInfo = await api.getThreadInfo(threadID);
 if (newInfo.adminIDs.some(i => i.id == targetID)) {
 await api.changeAdminStatus(threadID, targetID, false);
 api.sendMessage(
`⏱️ সময় শেষ!

👤 ${name} এখন আর Admin না`,
 threadID
 );
 }
 } catch {}
 }, time * 60 * 60 * 1000);
 }

 saveData(data);

 // 📩 ইনবক্স নোটিফাই
 api.sendMessage(
`🎉 অভিনন্দন!

আপনাকে একটি গ্রুপে Admin বানানো হয়েছে ✅`,
 targetID
 );

 // 📊 লগ
 console.log(`[ADMIN LOG] ${event.senderID} -> ${targetID}`);

 return api.sendMessage(
`╔════════════════════╗
 ✅ 𝗔𝗗𝗗 𝗔𝗗𝗠𝗜𝗡
╚════════════════════╝

👤 নাম: ${name}
🆔 UID: ${targetID}

${!isNaN(time) ? `⏱️ সময়: ${time} ঘন্টা` : "🔒 স্থায়ী Admin"}

🛡️ Protected System চালু`,
 threadID,
 messageID
 );

 } catch (e) {
 return api.sendMessage(
`╔════════════════════╗
 ❌ ব্যর্থ
╚════════════════════╝

⚠️ Admin করতে সমস্যা হয়েছে!`,
 threadID,
 messageID
 );
 }
};

// 🛡️ Protection System
module.exports.handleEvent = async function ({ api, event }) {
 const { threadID, logMessageType, logMessageData } = event;

 if (logMessageType !== "log:thread-admins") return;

 const data = loadData();
 if (!data[threadID]) return;

 const removed = logMessageData.ADMIN_EVENT == "remove_admin";
 const targetID = logMessageData.TARGET_ID;

 // 🔒 Protected admin remove হলে auto add
 if (removed && data[threadID].owners.includes(targetID)) {
 try {
 await api.changeAdminStatus(threadID, targetID, true);
 api.sendMessage(
`╔════════════════════╗
 🛡️ প্রোটেকশন চালু
╚════════════════════╝

❌ Protected Admin remove করা যাবে না!
✅ আবার Admin করে দেওয়া হয়েছে`,
 threadID
 );
 } catch {}
 }
};
