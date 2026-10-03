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

// ================= ENHANCED PROMPT PROCESSOR =================
function smartPrompt(text) {
  const t = text.toLowerCase();

  // প্রি-ডিফাইনেড ম্যাপ (পুরোনো সব ফিচার + নতুন)
  const map = {
    // ===== মানুষ =====
    "মেয়ে": "add a beautiful girl beside the person",
    "ছেলে": "add a handsome boy beside the person",
    "বন্ধু": "add a friend beside the person",
    "পুলিশ": "add a police officer",
    "সুপারহিরো": "add a superhero",
    
    // ===== স্টাইল =====
    "anime": "convert image to anime style",
    "কার্টুন": "convert image to cartoon style",
    "স্কেচ": "convert image to pencil sketch",
    "অয়েল": "convert image to oil painting",
    "ওয়াটার কালার": "convert image to watercolor",
    
    // ===== কোয়ালিটি =====
    "4k": "enhance image to ultra HD 4K quality",
    "hd": "enhance image quality",
    "hdr": "apply HDR effect",
    
    // ===== ব্যাকগ্রাউন্ড =====
    "বিচ": "change background to beach",
    "প্যারিস": "change background to Paris",
    "ফরেস্ট": "change background to forest",
    "জঙ্গল": "change background to forest",
    "স্পেস": "change background to space",
    "মাউন্টেন": "change background to mountain",
    "পাহাড়": "change background to mountain",
    "সিটি": "change background to city",
    "শহর": "change background to city",
    
    // ===== ইফেক্ট =====
    "ফায়ার": "add fire effect",
    "আগুন": "add fire effect",
    "স্নো": "add snow effect",
    "বৃষ্টি": "add rain effect",
    "রেইন": "add rain effect",
    "এঞ্জেল": "add angel wings effect",
    "নিয়ন": "add neon glow effect",
    "গ্লো": "add glow effect",
    "স্পার্কল": "add sparkle effect",
    "শ্যাডো": "add dramatic shadow effect",
    
    // ===== রিমুভ =====
    "ব্যাকগ্রাউন্ড রিমুভ": "remove background completely",
    "ব্যাকগ্রাউন্ড রিমুভ": "remove background completely",
    "অবজেক্ট রিমুভ": "remove unwanted objects",
    "দাগ রিমুভ": "remove blemishes",
    
    // ===== কালার =====
    "ব্ল্যাক অ্যান্ড হোয়াইট": "convert to black and white",
    "সেপিয়া": "apply sepia tone",
    "ভিনটেজ": "apply vintage filter",
    "প্যাস্টেল": "apply pastel colors",
    "ভাইব্র্যান্ট": "enhance vibrant colors",
    
    // ===== পুরোনো ফিচার =====
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

  // প্রথমে চেক করি ম্যাপে আছে কিনা
  for (let key in map) {
    if (t.includes(key)) {
      return map[key];
    }
  }

  // যদি ম্যাপে না থাকে, তাহলে ইউজারের ইনপুটই ব্যবহার করি
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
│
│ 👤 PEOPLE: মেয়ে, ছেলে, বন্ধু, পুলিশ, সুপারহিরো
│ 🎨 STYLES: anime, কার্টুন, স্কেচ, অয়েল, ওয়াটার কালার
│ ✨ QUALITY: 4k, hd, hdr
│ 🌍 BG: বিচ, প্যারিস, ফরেস্ট, স্পেস, মাউন্টেন, সিটি
│ 🔥 EFFECTS: ফায়ার, স্নো, বৃষ্টি, এঞ্জেল, নিয়ন, গ্লো
│ 🗑 REMOVE: ব্যাকগ্রাউন্ড রিমুভ, অবজেক্ট রিমুভ, দাগ রিমুভ
│ 🎨 COLORS: ব্ল্যাক অ্যান্ড হোয়াইট, সেপিয়া, ভিনটেজ, প্যাস্টেল
│
│ 💡 Or write any custom prompt in English!
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

  // ===== SMART PROMPT PROCESSING =====
  const prompt = smartPrompt(promptRaw);
  
  // ডিবাগ: কনসোলে দেখানো হচ্ছে
  console.log(`📝 Original: ${promptRaw}`);
  console.log(`🎯 Processed: ${prompt}`);

  // ================= LOADING UI =================
  const loading = await new Promise(res => {
    api.sendMessage(
      `╭─❍ AI IMAGE EDITOR
│ 🎨 Processing...
│ 📝 ${promptRaw}
│ ⏳ Please wait...
╰──────────────`,
      threadID,
      (e, info) => res(info)
    );
  });

  try {
    const base = await getBaseApi();
    if (!base) throw new Error("API not found");

    // ===== API CALL WITH CORRECT PARAMETERS =====
    const apiUrl = `${base}/edit?url=${encodeURIComponent(imageUrl)}&p=${encodeURIComponent(prompt)}`;
    
    console.log(`🔗 API URL: ${apiUrl}`); // ডিবাগ

    const res = await axios.get(apiUrl, { timeout: 120000 });

    if (!res.data.success) {
      console.log("❌ API Response:", res.data);
      throw new Error(res.data.message || "Edit failed");
    }

    // ===== DOWNLOAD EDITED IMAGE =====
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

    // ================= SUCCESS RESPONSE =================
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
      () => {
        try { fs.unlinkSync(filePath); } catch(e) {}
      },
      messageID
    );

  } catch (e) {
    console.error("❌ Error:", e);
    api.unsendMessage(loading.messageID);
    return api.sendMessage(
      `❌ Error: ${e.message || "Image edit failed. Try again."}`,
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
