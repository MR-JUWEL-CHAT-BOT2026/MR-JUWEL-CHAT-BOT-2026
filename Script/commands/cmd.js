const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "cmd",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "MR JUWEL (বাংলা) ভার্সন",
  description: "কমান্ড নিয়ন্ত্রণ সিস্টেম",
  commandCategory: "System",
  usages: "[load/unload/reload/loadAll/unloadAll/info/count/watch]",
  cooldowns: 2
};

// ===== পারমিশন সিস্টেম =====
const ADMIN = [
  "61591542717221"
];

const MOD = [
  "61584675610",
  "61575698441"
];

function checkPerm(uid, level) {
  uid = String(uid);
  if (ADMIN.includes(uid)) return true;
  if (level == 1 && MOD.includes(uid)) return true;
  return false;
}

// ===== LOAD =====
function loadCommand(name) {
  const dir = __dirname + "/" + name + ".js";

  delete require.cache[require.resolve(dir)];
  const cmd = require(dir);

  if (!cmd.config || !cmd.run)
    throw new Error("মডিউল স্ট্রাকচার সঠিক না");

  global.client.commands.set(cmd.config.name, cmd);

  return `✅ লোড হয়েছে → ${cmd.config.name}`;
}

// ===== UNLOAD =====
function unloadCommand(name) {
  global.client.commands.delete(name);

  global.client.eventRegistered =
    global.client.eventRegistered.filter(i => i !== name);

  return `❌ আনলোড হয়েছে → ${name}`;
}

// ===== WATCH SYSTEM =====
let watcherEnabled = false;

function startWatcher(api, threadID) {
  if (watcherEnabled) return;

  watcherEnabled = true;

  fs.watch(__dirname, (eventType, filename) => {
    if (!filename || !filename.endsWith(".js")) return;

    const name = filename.replace(".js", "");

    try {
      loadCommand(name);
      api.sendMessage(`🔄 অটো রিলোড হয়েছে: ${name}`, threadID);
    } catch (e) {
      api.sendMessage(`⚠️ রিলোড সমস্যা: ${name}\n${e.message}`, threadID);
    }
  });
}

// ===== MAIN =====
module.exports.run = async function ({ event, args, api }) {
  const { threadID, messageID, senderID } = event;

  if (!checkPerm(senderID, 1)) {
    return api.sendMessage("❌ আপনার অনুমতি নেই!", threadID, messageID);
  }

  const action = args[0];
  const name = args[1];

  try {
    switch (action) {

      case "count":
        return api.sendMessage(
          `📦 মোট কমান্ড: ${global.client.commands.size}`,
          threadID,
          messageID
        );

      case "load":
        if (!name) return api.sendMessage("⚠️ মডিউলের নাম দিন!", threadID);
        return api.sendMessage(loadCommand(name), threadID, messageID);

      case "unload":
        if (!name) return api.sendMessage("⚠️ মডিউলের নাম দিন!", threadID);
        return api.sendMessage(unloadCommand(name), threadID, messageID);

      case "reload":
        if (!name) return api.sendMessage("⚠️ মডিউলের নাম দিন!", threadID);
        unloadCommand(name);
        return api.sendMessage(loadCommand(name), threadID, messageID);

      case "loadAll":
        const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".js"));

        let msg = "📥 সব মডিউল লোড হচ্ছে...\n\n";

        for (const file of files) {
          const n = file.replace(".js", "");
          try {
            msg += loadCommand(n) + "\n";
          } catch (e) {
            msg += `⚠️ ${n} → ${e.message}\n`;
          }
        }

        return api.sendMessage(msg, threadID, messageID);

      case "unloadAll":
        const all = Array.from(global.client.commands.keys());

        let msg2 = "📤 সব মডিউল আনলোড হচ্ছে...\n\n";

        for (const n of all) {
          if (n === "cmd") continue;
          msg2 += unloadCommand(n) + "\n";
        }

        return api.sendMessage(msg2, threadID, messageID);

      case "info":
        if (!name) return api.sendMessage("⚠️ মডিউলের নাম দিন!", threadID);

        const cmd = global.client.commands.get(name);

        if (!cmd) return api.sendMessage("❌ মডিউল পাওয়া যায়নি!", threadID);

        const c = cmd.config;

        // 💎 PREMIUM ENGLISH FRAME 1
        return api.sendMessage(
`╔═════〔 CMD DETAILS 〕═════╗
│ 📌 Name : ${c.name}
│ 👑 Author : ${c.credits}
│ ⚙️ Version : ${c.version}
│ 🔒 Permission : ${c.hasPermssion}
│ ⏱ Cooldown : ${c.cooldowns}s
│ 📦 Dependencies : ${(Object.keys(c.dependencies || {}).join(", ") || "None")}
╚═════════════════════════╝`,
          threadID,
          messageID
        );

      case "watch":
        if (!checkPerm(senderID, 2))
          return api.sendMessage("❌ শুধু এডমিন ব্যবহার করতে পারবে!", threadID);

        startWatcher(api, threadID);
        return api.sendMessage("👀 অটো রিলোড চালু হয়েছে", threadID, messageID);

      default:
        return api.sendMessage(
          "⚙️ ব্যবহার:\n" +
          "cmd load নাম\n" +
          "cmd unload নাম\n" +
          "cmd reload নাম\n" +
          "cmd loadAll\n" +
          "cmd unloadAll\n" +
          "cmd info নাম\n" +
          "cmd count\n" +
          "cmd watch",
          threadID,
          messageID
        );
    }

  } catch (err) {
    return api.sendMessage(
      "❌ সমস্যা হয়েছে:\n" + err.message,
      threadID,
      messageID
    );
  }
};
