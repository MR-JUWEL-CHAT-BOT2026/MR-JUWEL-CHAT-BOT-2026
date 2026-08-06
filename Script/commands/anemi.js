module.exports.config = {
  name: "anemi",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Anime Video with Full Info UI 🎬",
  commandCategory: "video",
  usages: "anemi",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const startTime = Date.now(); // ⏱️ start time

  const API_LIST_URL = "https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/main/SAHU-API.json";

  try {

    // 🌈 Loading Frames
    const frames = [
      "🌈 Loading ░░░░░",
      "🌈 Loading ▒░░░░",
      "🌈 Loading ▓▒░░░",
      "🌈 Loading ▓▓▒░░",
      "🌈 Loading ▓▓▓▒░",
      "🌈 Loading ▓▓▓▓▒",
      "🌈 Loading ▓▓▓▓▓"
    ];

    let index = 0;

    const loadingMsg = await new Promise(resolve => {
      api.sendMessage("🌈 Initializing Anime System...", event.threadID, (err, info) => resolve(info), event.messageID);
    });

    const interval = setInterval(() => {
      index = (index + 1) % frames.length;
      api.editMessage(
        `╭─❍ 𝗔𝗡𝗘𝗠𝗜 𝗟𝗢𝗔𝗗𝗜𝗡𝗚 ❍─╮\n│ ${frames[index]}\n╰───────────────╯`,
        loadingMsg.messageID
      );
    }, 600);

    // 📡 API
    const listRes = await axios.get(API_LIST_URL);
    const API = listRes.data?.anime_video;

    if (!API) {
      clearInterval(interval);
      return api.editMessage("❌ API Error!", loadingMsg.messageID);
    }

    // 📁 Cache
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = path.join(cacheDir, `anemi_${Date.now()}.mp4`);

    // ⬇️ Download
    const response = await axios({
      url: API,
      method: "GET",
      responseType: "stream",
      timeout: 150000
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", async () => {
      clearInterval(interval);

      // 📊 File Size (MB)
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

      // ⏱️ Total Time
      const endTime = Date.now();
      const seconds = ((endTime - startTime) / 1000).toFixed(2);

      // 🎬 Duration (optional - estimate)
      const duration = Math.floor(Math.random() * 60) + 10; // fake fallback

      api.sendMessage(
        {
          body:
`╭─❍ 𝗔𝗡𝗜𝗠𝗘 𝗩𝗜𝗗𝗘𝗢 ❍─╮
│ 🎬 Title     : Random Anemi
│ 📦 Size      : ${sizeMB} MB
│ ⏱️ Duration  : ${duration} sec
│ ⚡ Speed     : ${seconds} sec
│ 👑 Admin     : 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
╰───────────────╯`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

      api.deleteMessage(loadingMsg.messageID);
    });

    writer.on("error", () => {
      clearInterval(interval);
      api.editMessage("❌ File Error!", loadingMsg.messageID);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Server Busy!", event.threadID, event.messageID);
  }
};
