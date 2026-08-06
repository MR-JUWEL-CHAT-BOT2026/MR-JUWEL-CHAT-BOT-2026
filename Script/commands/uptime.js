const os = require('os'); 
const moment = require('moment-timezone'); 
const axios = require('axios'); 
const fs = require('fs');
const { execSync } = require("child_process"); // ✅ ADD

const startTime = new Date(); 
const startFile = __dirname + "/uptimeStart.json";

// 🔥 EXTRA ADD 
let pingHistory = []; 
let commandStats = {}; 
let errorLogs = [];

// ✅ NEW ADD
let ramHistory = [];
let restartFlag = false;

// 🔥 Save start time (persist) 
if (!fs.existsSync(startFile)) { 
  fs.writeFileSync(startFile, JSON.stringify({ start: startTime })); 
}

module.exports = { 
config: { 
name: "uptime", 
version: "3.0.0", 
hasPermssion: 0, 
credits: "MR JUWEL", 
description: "Show advanced system uptime.", 
commandCategory: "system", 
usages: "uptime", 
prefix: false, 
cooldowns: 5 
},

run: async function ({ api, event, Users, Threads }) { 
const { threadID } = event;

// 🔥 COMMAND TRACK   
commandStats["uptime"] = (commandStats["uptime"] || 0) + 1;    

try {      

// 🔹 Uptime (original)     
const uptimeSec = (new Date() - startTime) / 1000;     
const days = Math.floor(uptimeSec / 86400);     
const hours = Math.floor((uptimeSec % 86400) / 3600);     
const minutes = Math.floor((uptimeSec % 3600) / 60);     
const seconds = Math.floor(uptimeSec % 60);     
const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;      

// 🔹 RAM     
const totalMem = os.totalmem() / 1073741824;     
const freeMem = os.freemem() / 1073741824;     
const usedMem = totalMem - freeMem;     
const usedPercent = ((usedMem / totalMem) * 100).toFixed(1);      

// ✅ RAM HISTORY
ramHistory.push(freeMem);
if (ramHistory.length > 10) ramHistory.shift();

// ✅ MEMORY LEAK DETECT
let leak = "🟢 Normal";
if (ramHistory.length >= 5 && ramHistory[0] > ramHistory[ramHistory.length - 1]) {
  leak = "⚠️ Possible Leak";
}

// 🔹 CPU     
const cpuModel = os.cpus()[0].model;     
const cpuCount = os.cpus().length;     
const cpuSpeed = os.cpus()[0].speed;      

// 🔹 Time     
const now = moment.tz("Asia/Dhaka");     
const date = now.format("DD MMMM YYYY");     
const time = now.format("hh:mm:ss A");      

// 🔥 REAL PING     
const pingStart = Date.now();     
await api.sendMessage("⏳ Loading...", threadID);     
const ping = Date.now() - pingStart;      

// 🔥 PING HISTORY     
pingHistory.push(ping);     
if (pingHistory.length > 10) pingHistory.shift();     
const avgPing = Math.floor(pingHistory.reduce((a,b)=>a+b,0)/pingHistory.length);     
const bestPing = Math.min(...pingHistory);      

// ✅ GRAPH
const graph = pingHistory.map(v => v < 100 ? "▂" : v < 200 ? "▄" : v < 400 ? "▆" : "█").join("");

let pingStatus;     
if (ping < 100) pingStatus = "⚡ Ultra Fast";     
else if (ping < 200) pingStatus = "🚀 Stable";     
else if (ping < 400) pingStatus = "⚠️ Normal";     
else pingStatus = "🐢 Slow";      

// 🔥 INTERNET CHECK     
let internet = "✅ Online";     
try { await axios.get("https://google.com"); }     
catch { internet = "❌ Offline"; }      

// 🔥 API CHECK     
let apiStatus = "✅ OK";     
try { await axios.get("https://api.ipify.org"); }     
catch { apiStatus = "❌ ERROR"; }      

// ✅ MULTI NETWORK
let netMulti = "OK";
try {
  await axios.get("https://cloudflare.com");
  await axios.get("https://facebook.com");
} catch {
  netMulti = "ISSUE";
}

// 🔥 CACHE CLEANER     
try {
  const temp = "/tmp";
  if (fs.existsSync(temp)) {
    fs.readdirSync(temp).forEach(f => {
      try { fs.unlinkSync(temp + "/" + f); } catch {}
    });
  }
} catch {}      

// 🔥 STORAGE INFO     
let storage = "N/A";     
try {
  const stat = fs.statSync(".");
  storage = (stat.size / 1024).toFixed(2) + " KB";
} catch {}      

// 🔥 SMART STATUS     
let smartStatus = "🟢 PERFECT";     
if (usedPercent > 70) smartStatus = "🟡 NORMAL";     
if (usedPercent > 90) smartStatus = "🔴 OVERLOAD";      

// 🔥 AI HEALTH     
let ai = "🟢 Stable";     
if (usedPercent > 70) ai = "🟡 Might slow";     
if (usedPercent > 90) ai = "🔴 Lag expected";      

// 🔥 PROCESS INFO     
const memoryUsage = process.memoryUsage().rss / 1024 / 1024;     
const cpuUsage = process.cpuUsage();      

// 🔥 SYSTEM EXTRA     
const hostname = os.hostname();     
const platform = os.platform();     
const load = os.loadavg()[0].toFixed(2);      

// 🔥 THREAD LOAD     
let threadLoad = 1;      

// 🔥 MODULE CHECK     
let modules = "✅ uptime running";      

// ✅ DEPENDENCY CHECK
let deps = "OK";
try {
  require("axios");
  require("fs");
  require("moment-timezone");
} catch {
  deps = "ERROR";
}

// 🔥 PROGRESS BAR     
const bar = (percent) => {
  const total = 10;
  const filled = Math.round((percent / 100) * total);
  return "█".repeat(filled) + "░".repeat(total - filled);
};

// 🔥 IP INFO     
let ip = "N/A";     
try {
  const res = await axios.get("https://api.ipify.org?format=json");
  ip = res.data.ip;
} catch {}      

// ✅ GEO LOCATION
let location = "N/A";
try {
  const geo = await axios.get("http://ip-api.com/json");
  location = geo.data.country + " - " + geo.data.city;
} catch {}

// 🔥 USER + THREAD COUNT     
const userCount = Users ? Object.keys(await Users.getAll()).length : "N/A";     
const threadCount = Threads ? Object.keys(await Threads.getAll()).length : "N/A";      

// 🔥 AUTO ALERT     
let alert = "";
if (usedPercent > 90) alert = "⚠️ HIGH RAM USAGE!\n";

// ✅ CPU TEMP
let cpuTemp = "N/A";
try {
  cpuTemp = execSync("cat /sys/class/thermal/thermal_zone0/temp").toString();
  cpuTemp = (parseInt(cpuTemp)/1000).toFixed(1) + "°C";
} catch {}

// ✅ AUTO OPTIMIZE
let optimize = "OFF";
if (usedPercent > 80) {
  optimize = "ON";
  global.gc && global.gc();
}

// ✅ PREDICT
let predict = "Stable";
if (avgPing > 300) predict = "⚠️ Lag incoming";

// 🔥 FINAL STATUS     
const status =
usedPercent < 70 ? "✅ SYSTEM STABLE" :
usedPercent < 90 ? "⚠️ HIGH LOAD" :
"⛔ CRITICAL";      

const finalMsg = `
╭───〔⚙️ SYSTEM STATUS ⚙️〕───╮
│ 👑 OWNER: MR JUWEL
│ 🤖 BOT: RIYA
│ ⏰ UPTIME: ${uptimeFormatted}
├───────────────────────
│ 💻 OS: ${os.type()} ${os.arch()}
│ 🌐 PLATFORM: ${platform}
│ 🖥️ HOST: ${hostname}
│ 🧠 CPU: ${cpuModel}
│ 🔢 CORES: ${cpuCount}
│ ⚙️ SPEED: ${cpuSpeed} MHz
│ 📊 LOAD: ${load}
│ 💾 RAM: ${usedMem.toFixed(2)} / ${totalMem.toFixed(2)} GB
│ 📈 RAM BAR: ${bar(usedPercent)} (${usedPercent}%)
│ 🧩 NODE: ${process.version}
├───────────────────────
│ ⚙️ PROCESS RAM: ${memoryUsage.toFixed(2)} MB
│ ⚙️ CPU USED: ${JSON.stringify(cpuUsage)}
│ 👥 USERS: ${userCount}
│ 💬 GROUPS: ${threadCount}
├───────────────────────
│ 🌍 IP: ${ip}
│ 📍 LOCATION: ${location}
│ 📅 DATE: ${date}
│ ⏰ TIME: ${time}
│ 📡 PING: ${ping}ms (${pingStatus})
│ 📊 AVG: ${avgPing}ms | BEST: ${bestPing}ms
│ 📊 GRAPH: ${graph}
│ 🌐 INTERNET: ${internet}
│ 🌐 NET+: ${netMulti}
│ 🔗 API: ${apiStatus}
│ 🧠 AI: ${ai}
│ 🧠 LEAK: ${leak}
│ 🌡️ CPU TEMP: ${cpuTemp}
│ 🗂️ STORAGE: ${storage}
│ 🧵 THREAD: ${threadLoad}
│ 📊 CMD USED: ${commandStats["uptime"]}
│ 🧩 MODULE: ${modules}
│ 🧩 DEPS: ${deps}
│ 🧭 STATUS: ${status}
│ 🎯 SMART: ${smartStatus}
│ ♻️ OPTIMIZE: ${optimize}
│ 🔮 PREDICT: ${predict}
│ 🚨 ALERT: ${alert || "None"}
╰───────────────────────
`;

await api.sendMessage(finalMsg, threadID);

} catch (error) {
errorLogs.push(error.toString());
console.error("Uptime command error:", error);
await api.sendMessage("❌ Error occurred!", threadID);
}

} 
};
