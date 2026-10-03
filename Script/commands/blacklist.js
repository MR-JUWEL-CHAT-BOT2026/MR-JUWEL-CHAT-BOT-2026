module.exports.config = {
  name: "blacklist",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Persistent blacklist system (safe + restart proof)",
  commandCategory: "admin",
  usages: "[add/remove/list] [uid]",
  cooldowns: 3,

  // 🔥 20 UID রাখার জায়গা
  blacklistedUIDs: [
    "61588394316781", "100086923005807", "", "",
    "", "", "", "",
    "", "", "", "",
    "", "", "", "",
    "", "", "", ""
  ]
};

const fs = require("fs-extra");
const path = require("path");

// 📁 Safe storage location
const dir = path.join(__dirname, "../events/cache");
const filePath = path.join(dir, "blacklist.json");

// 🔧 Auto setup storage
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");

// 📥 Load safely (restart-safe)
function loadList() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);
    return Array.isArray(json) ? json : [];
  } catch (e) {
    fs.writeFileSync(filePath, "[]");
    return [];
  }
}

// 💾 Save safely
function saveList(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// 🎨 UI FRAME
const frame = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🚫 𝘽𝙇𝘼𝘾𝙆𝙇𝙄𝙎𝙏 𝙎𝙔𝙎𝙏𝙀𝙈 ┃
🔐 Persistent Mode ON
┗━━━━━━━━━━━━━━━━━━━━━━┛
`;

module.exports.run = async function ({ api, event, args }) {
  let list = loadList();

  const action = args[0];
  const uid = args[1];

  // ❌ no command
  if (!action) {
    return api.sendMessage(
      frame +
      "📌 ব্যবহার:\n" +
      "➤ blacklist add [uid]\n" +
      "➤ blacklist remove [uid]\n" +
      "➤ blacklist list\n",
      event.threadID
    );
  }

  // 📋 LIST
  if (action === "list") {
    if (list.length === 0) {
      return api.sendMessage(frame + "📭 কোনো ইউজার ব্ল্যাকলিস্টে নেই", event.threadID);
    }

    return api.sendMessage(
      frame +
      "📌 ব্ল্যাকলিস্ট ইউজার:\n\n" +
      list.map((id, i) => `➤ ${i + 1}. ${id}`).join("\n"),
      event.threadID
    );
  }

  // ⚠️ UID required
  if (!uid) {
    return api.sendMessage(frame + "⚠️ UID দিতে হবে", event.threadID);
  }

  // ➕ ADD
  if (action === "add") {
    if (list.includes(uid)) {
      return api.sendMessage(frame + "⚠️ ইউজার আগে থেকেই ব্ল্যাকলিস্টে আছে", event.threadID);
    }

    list.push(uid);
    saveList(list);

    return api.sendMessage(
      frame +
      "✅ সফলভাবে ব্ল্যাকলিস্টে যোগ করা হয়েছে\n\n" +
      "👤 UID: " + uid + "\n" +
      "📌 স্ট্যাটাস: BLOCKED",
      event.threadID
    );
  }

  // ➖ REMOVE
  if (action === "remove") {
    if (!list.includes(uid)) {
      return api.sendMessage(frame + "⚠️ এই UID ব্ল্যাকলিস্টে নেই", event.threadID);
    }

    list = list.filter(id => id !== uid);
    saveList(list);

    return api.sendMessage(
      frame +
      "✅ ব্ল্যাকলিস্ট থেকে সরানো হয়েছে\n\n" +
      "👤 UID: " + uid +
      "\n📌 স্ট্যাটাস: UNBLOCKED",
      event.threadID
    );
  }

  return api.sendMessage(frame + "❌ ভুল কমান্ড ব্যবহার করা হয়েছে", event.threadID);
};
