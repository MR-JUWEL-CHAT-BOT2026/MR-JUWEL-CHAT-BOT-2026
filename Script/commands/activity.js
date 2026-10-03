const fs = require("fs");
const path = __dirname + "/cache/activity.json";

// cache folder
if (!fs.existsSync(__dirname + "/cache")) {
  fs.mkdirSync(__dirname + "/cache");
}

// load
let data = {};
if (fs.existsSync(path)) {
  try {
    data = JSON.parse(fs.readFileSync(path, "utf8"));
  } catch {
    data = {};
  }
}

// save (anti spam write)
let saveTimeout;
const save = () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }, 800);
};

// level system
function getLevel(xp) {
  xp = Number(xp) || 0;
  return Math.floor(0.1 * Math.sqrt(xp));
}

function getNextXP(level) {
  return Math.floor(Math.pow((level + 1) / 0.1, 2));
}

// badge system
function getBadge(level) {
  if (level >= 50) return "👑 KING";
  if (level >= 30) return "🔥 LEGEND";
  if (level >= 15) return "⚡ PRO";
  if (level >= 5) return "🌟 ACTIVE";
  return "🆕 NEW";
}

// time format
function formatTime(ms) {
  let d = Math.floor(ms / (1000 * 60 * 60 * 24));
  let h = Math.floor((ms / (1000 * 60 * 60)) % 24);
  let m = Math.floor((ms / (1000 * 60)) % 60);
  return `${d}d ${h}h ${m}m`;
}

module.exports.config = {
  name: "activity",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R JUWEL x ChatGPT PRO",
  description: "Ultra Activity + UI + Badge System",
  commandCategory: "group",
  usages: "[top/inactive/me]",
  cooldowns: 3
};

// TRACK
module.exports.handleEvent = function ({ event }) {
  if (!event.senderID) return;

  let uid = event.senderID;

  if (!data[uid]) {
    data[uid] = { xp: 0, msg: 0, last: Date.now() };
  }

  data[uid].xp = Number(data[uid].xp || 0) + 5;
  data[uid].msg = Number(data[uid].msg || 0) + 1;
  data[uid].last = Date.now();

  save();
};

// COMMAND
module.exports.run = async function ({ api, event }) {
  const { threadID, senderID, body } = event;

  let threadInfo = await api.getThreadInfo(threadID);
  let users = threadInfo.userInfo || [];
  let now = Date.now();

  let arr = users.map(u => {
    let d = data[u.id] || { xp: 0, msg: 0, last: 0 };

    let xp = Number(d.xp) || 0;
    let msg = Number(d.msg) || 0;

    let level = getLevel(xp);
    let nextXP = getNextXP(level);
    let badge = getBadge(level);

    let inactiveTime = d.last ? now - d.last : 999999999;

    let status =
      inactiveTime < 5 * 60 * 1000 ? "🟢 Online" :
      inactiveTime < 60 * 60 * 1000 ? "🟡 Active" :
      "🔴 Offline";

    return {
      uid: u.id,
      name: u.name || "Facebook User",
      xp,
      msg,
      level,
      nextXP,
      badge,
      inactiveTime,
      inactive: formatTime(inactiveTime),
      status
    };
  });

  let args = body ? body.split(" ")[1] : "top";

  // 🏆 TOP UI
  if (args === "top") {
    let sorted = arr.sort((a, b) => b.xp - a.xp).slice(0, 10);

    let msg = `━━━━━━━━━━━━━━━━━━━━━━
🔥 𝗧𝗢𝗣 𝗔𝗖𝗧𝗜𝗩𝗘 𝗨𝗦𝗘𝗥𝗦 🔥
━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    sorted.forEach((u, i) => {
      let medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🔹";

      msg += `${medal} ${u.name}
${u.badge} | Level: ${u.level}
⚡ XP: ${u.xp}
📊 Msg: ${u.msg}
📶 ${u.status}

──────────────────────\n\n`;
    });

    return api.sendMessage(msg, threadID);
  }

  // ❄️ INACTIVE UI
  if (args === "inactive") {
    let list = arr.sort((a, b) => b.inactiveTime - a.inactiveTime).slice(0, 15);

    let msg = `━━━━━━━━━━━━━━━━━━━━━━
❄️ 𝗜𝗡𝗔𝗖𝗧𝗜𝗩𝗘 𝗨𝗦𝗘𝗥𝗦 ❄️
━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    list.forEach((u, i) => {
      msg += `${i + 1}. ${u.name}
🕒 ${u.inactive}
📶 ${u.status}

──────────────────────\n\n`;
    });

    return api.sendMessage(msg, threadID);
  }

  // 👤 ME UI
  if (args === "me") {
    let me = arr.find(u => u.uid == senderID);
    if (!me) return api.sendMessage("No data found", threadID);

    return api.sendMessage(`━━━━━━━━━━━━━━━━━━━━━━
👤 𝗬𝗢𝗨𝗥 𝗣𝗥𝗢𝗙𝗜𝗟𝗘
━━━━━━━━━━━━━━━━━━━━━━

${me.badge}
⭐ Level: ${me.level}
⚡ XP: ${me.xp} / ${me.nextXP}
📊 Messages: ${me.msg}
📶 Status: ${me.status}

━━━━━━━━━━━━━━━━━━━━━━`, threadID);
  }

  return api.sendMessage(
    "📊 Commands:\n.activity top\n.activity inactive\n.activity me",
    threadID
  );
};
