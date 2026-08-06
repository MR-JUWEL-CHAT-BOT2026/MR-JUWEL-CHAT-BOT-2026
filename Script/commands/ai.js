const axios = require("axios");
const fs = require("fs");

const apiUrl = "https://api.nixhost.top/aryan/gemini";
const dbPath = __dirname + "/gemini_db.json";

function loadDB() {
  if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}");
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "gemini",
  version: "1.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Gemini AI Chat (UI + reply system)",
  commandCategory: "ai",
  usages: "[question]",
  cooldowns: 5,
  aliases: ["ai", "gem"]
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const content = args.join(" ");

  if (!content) {
    return api.sendMessage("❌ কিছু জিজ্ঞেস করো বেবি ❤️", threadID, messageID);
  }

  return askAI(api, threadID, messageID, senderID, content);
};

// Reply handler
module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, messageReply, body } = event;

  if (!messageReply || !body) return;

  const db = loadDB();
  if (!db[messageReply.messageID]) return;

  return askAI(api, threadID, messageID, senderID, body);
};

async function askAI(api, threadID, messageID, senderID, content) {

  api.sendMessage("🔎 প্রশ্ন খুঁজতেছি...\n⏳ অপেক্ষা করো বেবি...", threadID, async (err, info) => {
    try {

      const res = await axios.get(apiUrl, {
        params: { prompt: content, q: content }
      });

      const answer =
        res.data.answer ||
        res.data.response ||
        res.data.result ||
        res.data.message ||
        JSON.stringify(res.data);

      // UI DESIGN
      const ui = `
╭─❍
│ 🤖 AI ASSISTANT
╰───────────────⧕

📝 𝗬𝗼𝘂𝗿 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻:
╭─────────────
${content}
╰─────────────

💬 𝗔𝗜 𝗥𝗲𝗽𝗹𝘆:
╭─────────────
${answer}
╰─────────────

╭─────────────
│ ❤️ Gemini AI Chat
│ 👑 Credits: 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
╰─────────────
`;

      api.editMessage(ui, info.messageID);

      // Save for reply tracking
      const db = loadDB();
      db[info.messageID] = {
        threadID,
        senderID,
        prompt: content
      };
      saveDB(db);

    } catch (e) {
      api.editMessage("❌ Error: " + e.message, info.messageID);
    }
  }, messageID);
}
