const chalk = require("chalk");
const fs = require("fs");

const logFile = __dirname + "/joinHistory.json";

if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, "[]");

function saveLog(data) {
 fs.writeFileSync(logFile, JSON.stringify(data, null, 2));
}

function addLog(entry) {
 let data = JSON.parse(fs.readFileSync(logFile));
 data.push(entry);
 saveLog(data);
}

module.exports.config = {
 name: "join",
 version: "5.0.3",
 hasPermssion: 2,
 credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
 description: "REAL CLEAN GROUP JOIN SYSTEM",
 commandCategory: "system",
 cooldowns: 5
};

let autoMode = false;

module.exports.onLoad = () => {
 console.log(chalk.hex("#00ff99")("🚀 CLEAN JOIN SYSTEM LOADED"));
};

// ---------------- HANDLE REPLY ----------------
module.exports.handleReply = async function ({ api, event, handleReply }) {
 const { threadID, senderID, body } = event;
 const { ID, author } = handleReply;

 if (senderID != author) return;

 const input = (body || "").trim().toLowerCase();
 let selected = [];

 if (input === "add all") {
 selected = ID.map((_, i) => i);
 } else {
 selected = input.split(/\s+/)
 .map(x => parseInt(x) - 1)
 .filter(i => !isNaN(i) && i >= 0 && i < ID.length);
 }

 if (selected.length === 0)
 return api.sendMessage("❌ Invalid input", threadID);

 let result = {
 added: 0,
 already: 0,
 failed: 0,
 retry: 0,
 details: []
 };

 for (const i of selected) {
 const tid = ID[i];

 try {
 const info = await api.getThreadInfo(tid);
 const botID = api.getCurrentUserID();

 const isMember = info.participantIDs.includes(botID);

 if (isMember) {
 result.already++;

 result.details.push(
 `⚠️ Already Joined → ${info.name}`
 );

 addLog({
 user: senderID,
 threadID: tid,
 name: info.name,
 status: "Already Joined",
 time: new Date().toISOString()
 });

 continue;
 }

 let success = false;

 for (let r = 0; r < 3; r++) {
 try {
 await api.addUserToGroup(botID, tid);
 success = true;
 result.retry += r;
 break;
 } catch {
 await new Promise(res => setTimeout(res, 700));
 }
 }

 if (success) {
 result.added++;
 result.details.push(`✅ Joined → ${info.name}`);
 } else {
 result.failed++;
 result.details.push(`❌ Failed → ${info.name}`);
 }

 addLog({
 user: senderID,
 threadID: tid,
 name: info.name,
 status: success ? "Joined" : "Failed",
 time: new Date().toISOString()
 });

 } catch {
 result.failed++;
 result.details.push(`❌ Error → Unknown Group`);
 }
 }

 return api.sendMessage(
`╔══════════════════════╗
║ ⚡ REAL-TIME REPORT
╠══════════════════════╣
║ ✅ Added : ${result.added}
║ ⚠️ Already : ${result.already}
║ ❌ Failed : ${result.failed}
║ 🔄 Retry : ${result.retry}
╚══════════════════════╝

📌 DETAILS:
${result.details.join("\n") || "No Data"}

⚡ MODE: ${autoMode ? "AUTO ON" : "AUTO OFF"}`,
 threadID
 );
};

// ---------------- MAIN ----------------
module.exports.run = async function ({ api, event }) {
 const { threadID, senderID, messageID } = event;

 const adminUID = "61591542717221";
 if (senderID !== adminUID)
 return api.sendMessage("⚠️ Only Admin can use this command", threadID);

 let inbox = await api.getThreadList(100, null, ["INBOX"]);

 let groups = inbox.filter(t =>
 t.isGroup &&
 t.threadID &&
 t.name &&
 t.participantIDs &&
 t.participantIDs.includes(api.getCurrentUserID())
 );

 let msg = `╔══════════════════════╗
║ ⚡ REAL-TIME GROUP LIST
╚══════════════════════╝\n\n`;

 const ID = [];

 groups.forEach((t, i) => {
 msg += `┃ ${i + 1}. ${t.name}\n`;
 ID.push(t.threadID);
 });

 if (ID.length === 0)
 return api.sendMessage("⚠️ কোনো গ্রুপ পাওয়া যায়নি", threadID);

 msg += `\n╔══════════════════════╗
║ ✏️ Reply: 1 2 3 / add all
║ 🔒 ADMIN ONLY MODE
╚══════════════════════╝`;

 return api.sendMessage(msg, threadID, (err, info) => {
 if (!err) {
 global.client.handleReply.push({
 name: module.exports.config.name,
 author: senderID,
 messageID: info.messageID,
 ID
 });
 }
 }, messageID);
};

// ---------------- AUTO MODE ----------------
module.exports.handleEvent = async function ({ api, event }) {
 const body = (event.body || "").toLowerCase();

 if (body === "auto on") {
 autoMode = true;
 return api.sendMessage("🟢 AUTO MODE ON", event.threadID);
 }

 if (body === "auto off") {
 autoMode = false;
 return api.sendMessage("🔴 AUTO MODE OFF", event.threadID);
 }
};
