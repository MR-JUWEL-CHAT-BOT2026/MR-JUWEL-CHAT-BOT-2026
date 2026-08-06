const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// ================= CONFIG =================
module.exports.config = {
  name: "edit",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Advanced AI Image Editor",
  commandCategory: "ai",
  usages: "edit [prompt]",
  cooldowns: 1
};

// ================= MEMORY =================
const cooldown = new Map();
const stats = new Map();
const history = new Map();

// ================= BASE API =================
async function getBaseApi() {
  try {
    const res = await axios.get(
      "https://noobs-api-team-url.vercel.app/N1SA9/baseApiUrl.json"
    );
    return res.data.rifat;
  } catch {
    return null;
  }
}

// ================= PROMPT MAP =================
function smartPrompt(text) {
  const t = text.toLowerCase();

  const map = {
    "মেয়ে": "add a beautiful girl beside the person",
    "ছেলে": "add a handsome boy beside the person",
    "বন্ধু": "add a friend beside the person",
    "পুলিশ": "add a police officer",
    "সুপারহিরো": "add a superhero",
    "anime": "convert image to anime style",
    "কার্টুন": "convert image to cartoon style",
    "4k": "enhance image to ultra HD 4K quality",
    "hd": "enhance image quality",
    "background remove": "remove background",
    "blur": "blur background",
    "beach": "change background beach",
    "paris": "change background paris",
    "forest": "change background forest",
    "space": "change background space",
    "mountain": "change background mountain",
    "fire": "fire effect",
    "snow": "snow effect",
    "angel": "angel wings effect",
    "neon": "neon glow effect"
  };

  for (let key in map) {
    if (t.includes(key)) return map[key];
  }

  return text;
}

// ================= RUN =================
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  let userCooldown = cooldown.get(senderID) || 0;
  let now = Date.now();

  const isAdmin = global.config.ADMINBOT.includes(senderID);

  // ================= COOLDOWN =================
  if (!isAdmin && userCooldown > now) {
    const left = Math.ceil((userCooldown - now) / 1000);
    return api.sendMessage(
      `╭─❍ COOLDOWN\n│ ⏳ Wait ${left}s\n╰──────────────`,
      threadID,
      messageID
    );
  }

  const promptRaw = args.join(" ");
  if (!promptRaw) {
    return api.sendMessage(
      `╭─❍ AI EDIT MENU
│ 🎨 anime / কার্টুন / 4k
│ 👧 মেয়ে / ছেলে / বন্ধু
│ 🌍 beach / forest / space
│ 🔥 fire / snow / neon
╰──────────────`,
      threadID,
      messageID
    );
  }

  if (
    event.type !== "message_reply" ||
    !event.messageReply.attachments ||
    !event.messageReply.attachments[0]
  ) {
    return api.sendMessage(
      "❌ Please reply to an image",
      threadID,
      messageID
    );
  }

  const imageUrl = event.messageReply.attachments[0].url;

  const prompt = smartPrompt(promptRaw);

  // ================= LOADING UI =================
  const loading = await new Promise(res => {
    api.sendMessage(
      `╭─❍ AI IMAGE EDITOR
│ 🎨 Processing...
│ 📝 ${promptRaw}
╰──────────────`,
      threadID,
      (e, info) => res(info)
    );
  });

  try {
    const base = await getBaseApi();
    if (!base) throw new Error("API not found");

    const apiUrl = `${base}/edit?url=${encodeURIComponent(imageUrl)}&p=${encodeURIComponent(prompt)}`;

    const res = await axios.get(apiUrl, { timeout: 120000 });

    if (!res.data.success) throw new Error("Edit failed");

    const img = await axios.get(res.data.catbox_url, {
      responseType: "arraybuffer"
    });

    const filePath = path.join(__dirname, "cache", `edit_${Date.now()}.png`);

    await fs.writeFile(filePath, Buffer.from(img.data));

    api.unsendMessage(loading.messageID);

    // ================= STATS =================
    stats.set(senderID, (stats.get(senderID) || 0) + 1);

    // ================= HISTORY =================
    const userHistory = history.get(senderID) || [];
    userHistory.unshift(promptRaw);
    history.set(senderID, userHistory.slice(0, 5));

    // ================= COOLDOWN SET =================
    if (!isAdmin) {
      cooldown.set(senderID, now + 70000);
    }

    return api.sendMessage(
      {
        body:
`╭━━━━━━━━━━━━━━╮
┃ ✅ EDIT COMPLETE
┃
┃ 🎨 Prompt: ${promptRaw}
┃ 👤 Edits: ${stats.get(senderID)}
┃
┃ 👑 Credits:
┃ 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟EL
╰━━━━━━━━━━━━━━╯`,
        attachment: fs.createReadStream(filePath)
      },
      threadID,
      () => fs.unlinkSync(filePath),
      messageID
    );

  } catch (e) {
    api.unsendMessage(loading.messageID);
    return api.sendMessage(
      "❌ Image edit failed. Try again.",
      threadID,
      messageID
    );
  }
};

// ================= EXTRA COMMANDS =================
module.exports.history = (event, api) => {
  const data = history.get(event.senderID) || [];
  return api.sendMessage(
    data.length
      ? "╭─❍ HISTORY\n" + data.map((x, i) => `│ ${i + 1}. ${x}`).join("\n") + "\n╰──────────────"
      : "No history found",
    event.threadID,
    event.messageID
  );
};

module.exports.stats = (event, api) => {
  return api.sendMessage(
    `╭─❍ STATS\n│ Total Edits: ${stats.get(event.senderID) || 0}\n╰──────────────`,
    event.threadID,
    event.messageID
  );
};
