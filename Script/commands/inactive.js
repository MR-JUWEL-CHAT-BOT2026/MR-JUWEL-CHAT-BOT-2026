module.exports.config = {
 name: "inactive",
 version: "3.0.0",
 hasPermssion: 1,
 credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
 description: "30 days inactive tracker + kick system",
 commandCategory: "group",
 usages: "inactive",
 cooldowns: 5
};

const fs = require("fs-extra");

const path = __dirname + "/cache/activity.json";
const DAY30 = 30 * 24 * 60 * 60 * 1000;

/* ================= ACTIVITY TRACKER ================= */
module.exports.handleEvent = async ({ event }) => {
 try {
 if (!event.senderID || !event.threadID) return;

 if (!fs.existsSync(__dirname + "/cache")) {
 fs.mkdirSync(__dirname + "/cache");
 }

 if (!fs.existsSync(path)) {
 fs.writeFileSync(path, JSON.stringify({}));
 }

 let data = JSON.parse(fs.readFileSync(path));

 if (!data[event.threadID]) data[event.threadID] = {};

 data[event.threadID][event.senderID] = Date.now();

 fs.writeFileSync(path, JSON.stringify(data, null, 2));
 } catch (e) {}
};

/* ================= MAIN COMMAND ================= */
module.exports.run = async ({ api, event }) => {
 const { threadID } = event;

 if (!fs.existsSync(path)) {
 return api.sendMessage("❌ No activity data found", threadID);
 }

 let data = JSON.parse(fs.readFileSync(path));
 let threadData = data[threadID] || {};

 let info = await api.getThreadInfo(threadID);
 let now = Date.now();

 let inactive = [];

 for (let user of info.participantIDs) {
 let last = threadData[user] || 0;

 if (now - last >= DAY30) {
 inactive.push(user);
 }
 }

 if (!inactive.length) {
 return api.sendMessage("✅ No inactive members (30 days)", threadID);
 }

 /* ================= BEAUTIFUL FRAME ================= */
 let msg =
`╔══════════════════════╗
║ 🔥 INACTIVE SYSTEM ║
╚══════════════════════╝

📌 Total Inactive: ${inactive.length}
⏳ Limit: 30 Days

━━━━━━━━━━━━━━━━━━━━━━
📋 LIST:
`;

 for (let i = 0; i < inactive.length; i++) {
 try {
 let u = await api.getUserInfo(inactive[i]);
 msg += `\n${i + 1}. ${u[inactive[i]].name}`;
 } catch {
 msg += `\n${i + 1}. Unknown User`;
 }
 }

 msg += `

━━━━━━━━━━━━━━━━━━━━━━
👉 Reply:
• all → Kick all inactive
• 1 2 3 → Select kick
━━━━━━━━━━━━━━━━━━━━━━`;

 return api.sendMessage(msg, threadID, (err, info) => {
 global.client.handleReply.push({
 name: this.config.name,
 messageID: info.messageID,
 author: event.senderID,
 type: "kick",
 list: inactive
 });
 });
};

/* ================= HANDLE REPLY ================= */
module.exports.handleReply = async ({ api, event, handleReply }) => {
 const { threadID, body } = event;

 if (handleReply.type !== "kick") return;

 let list = handleReply.list;

 /* ===== ALL KICK ===== */
 if (body.toLowerCase() === "all") {
 let success = 0;

 for (let id of list) {
 try {
 await api.removeUserFromGroup(id, threadID);
 success++;
 } catch {}
 }

 return api.sendMessage(
`╔══════════════╗
║ ✅ DONE ║
╚══════════════╝

🔥 Kicked: ${success} inactive users`,
 threadID
 );
 }

 /* ===== SELECT KICK ===== */
 let nums = body.split(" ").map(x => parseInt(x) - 1);

 let success = 0;

 for (let i of nums) {
 if (!list[i]) continue;

 try {
 await api.removeUserFromGroup(list[i], threadID);
 success++;
 } catch {}
 }

 return api.sendMessage(
`╔══════════════╗
║ ⚡ SUCCESS ║
╚══════════════╝

🔥 Kicked: ${success} users`,
 threadID
 );
};
