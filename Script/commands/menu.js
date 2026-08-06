const fs = require("fs");
const path = require("path");

const COMMANDS_DIR = path.join(__dirname);
const dbPath = path.join(__dirname, "database.json");
const logPath = path.join(__dirname, "log.json");
const backupDir = path.join(__dirname, "backup");

// ================= DATABASE =================
function getDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}");
  return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// ================= LOG SYSTEM =================
function logAction(data) {
  let logs = [];
  if (fs.existsSync(logPath)) {
    logs = JSON.parse(fs.readFileSync(logPath));
  }

  logs.push({
    সময়: new Date().toLocaleString(),
    কাজ: data.action,
    ইউজার: data.user,
    গ্রুপ: data.thread
  });

  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
}

// ================= COMMAND LIST =================
function listCommands() {
  return fs.readdirSync(COMMANDS_DIR)
    .filter(f => f.endsWith(".js") && f !== path.basename(__filename))
    .map(f => f.replace(/\.js$/, ""));
}

// ================= CONFIG =================
module.exports.config = {
  name: "menu",
  version: "4.0.0",
  hasPermssion: 1,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "🔥 বাংলা প্রো কন্ট্রোল প্যানেল",
  commandCategory: "system",
  usages: "menu",
  cooldowns: 2
};

// ================= MENU UI =================
module.exports.run = async function ({ api, event, Threads }) {
  const data = (await Threads.getData(event.threadID))?.data || {};
  const cmds = listCommands();

  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const m = Math.floor((uptime % 3600) / 60);

  const menu = `
╭━━━〔 🔥 বট কন্ট্রোল প্যানেল 〕━━━╮
┃ 🟢 বট স্ট্যাটাস : ${data.banned ? "বন্ধ 🚫" : "চালু 🟢"}
┃ 📦 কমান্ড সংখ্যা : ${cmds.length}
┃ ⏱ আপটাইম : ${h} ঘন্টা ${m} মিনিট
╰━━━━━━━━━━━━━━━━━━━━━━╯

1️⃣ 📊 বট স্ট্যাটাস দেখাও
2️⃣ 🧩 কমান্ড তালিকা
3️⃣ 🗑️ কমান্ড ডিলিট করুন
4️⃣ 🚫 এই চ্যাটে বট বন্ধ করুন
5️⃣ 🟢 এই চ্যাটে বট চালু করুন
6️⃣ ♻️ বট রিস্টার্ট করুন

👉 নিচে অপশনের নম্বর লিখুন
`;

  return api.sendMessage(menu, event.threadID, (err, info) => {
    if (err) return;

    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      author: event.senderID,
      type: "menu"
    });
  });
};

// ================= HANDLE REPLY =================
module.exports.handleReply = async function ({ api, event, handleReply, Threads }) {
  if (event.senderID !== handleReply.author) return;

  const reply = (msg, cb) => api.sendMessage(msg, event.threadID, cb);
  const data = (await Threads.getData(event.threadID))?.data || {};

  // ================= MENU =================
  if (handleReply.type === "menu") {
    const choice = event.body.trim();

    switch (choice) {

      // 📊 STATUS
      case "1": {
        const cmds = listCommands();
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);

        return reply(`
📊 বট স্ট্যাটাস রিপোর্ট

🟢 বট : ${data.banned ? "বন্ধ 🚫" : "চালু 🟢"}
📦 কমান্ড : ${cmds.length}
⏱ আপটাইম : ${h} ঘন্টা ${m} মিনিট
`);
      }

      // 🧩 COMMAND LIST
      case "2": {
        const cmds = listCommands();
        return reply(
          `🧩 কমান্ড তালিকা (${cmds.length})\n\n${cmds.map((c, i) => `${i + 1}. ${c}`).join("\n")}`
        );
      }

      // 🗑 DELETE COMMAND
      case "3": {
        const cmds = listCommands();

        return reply(
          `🗑️ কোন কমান্ড ডিলিট করবেন?\n\n${cmds.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n👉 নম্বর লিখুন`,
          (err, info) => {
            global.client.handleReply.push({
              name: module.exports.config.name,
              messageID: info.messageID,
              author: event.senderID,
              type: "deletePick",
              cmds
            });
          }
        );
      }

      // 🚫 BAN
      case "4": {
        const db = getDB();
        db[event.threadID] = db[event.threadID] || {};
        db[event.threadID].banned = 1;
        saveDB(db);

        logAction({
          action: "বন্ধ করা হয়েছে",
          user: event.senderID,
          thread: event.threadID
        });

        return reply("🚫 এই গ্রুপে বট বন্ধ করা হয়েছে।");
      }

      // 🟢 UNBAN
      case "5": {
        const db = getDB();
        db[event.threadID] = db[event.threadID] || {};
        db[event.threadID].banned = 0;
        saveDB(db);

        logAction({
          action: "চালু করা হয়েছে",
          user: event.senderID,
          thread: event.threadID
        });

        return reply("🟢 এই গ্রুপে বট চালু করা হয়েছে।");
      }

      // ♻️ RESTART
      case "6": {
        return reply("♻️ বট রিস্টার্ট হচ্ছে...", () => {
          setTimeout(() => process.exit(1), 1200);
        });
      }

      default:
        return reply("❌ ভুল অপশন দেওয়া হয়েছে");
    }
  }

  // ================= DELETE PICK =================
  if (handleReply.type === "deletePick") {
    const idx = parseInt(event.body) - 1;
    const list = handleReply.cmds;

    if (isNaN(idx) || idx < 0 || idx >= list.length)
      return api.sendMessage("❌ ভুল নম্বর", event.threadID);

    const name = list[idx];

    return api.sendMessage(
      `⚠️ নিশ্চিত করুন\n\nফাইল: ${name}.js\n\nyes / no লিখুন`,
      event.threadID,
      (err, info) => {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "confirmDelete",
          cmdName: name
        });
      }
    );
  }

  // ================= CONFIRM DELETE =================
  if (handleReply.type === "confirmDelete") {
    const ans = event.body.toLowerCase().trim();
    const name = handleReply.cmdName;

    if (!["yes", "y", "no", "n"].includes(ans))
      return api.sendMessage("👉 yes বা no লিখুন", event.threadID);

    if (ans.startsWith("n"))
      return api.sendMessage("❌ বাতিল করা হয়েছে", event.threadID);

    const safeName = path.basename(name, ".js");
    const filePath = path.join(COMMANDS_DIR, `${safeName}.js`);

    // BACKUP
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, path.join(backupDir, `${safeName}.js`));
    }

    try {
      fs.unlinkSync(filePath);

      logAction({
        action: "ডিলিট করা হয়েছে",
        user: event.senderID,
        thread: event.threadID
      });

      return api.sendMessage(`🗑️ সফলভাবে ডিলিট করা হয়েছে: ${safeName}.js`, event.threadID);
    } catch (e) {
      return api.sendMessage(`❌ সমস্যা হয়েছে: ${e.message}`, event.threadID);
    }
  }
};
