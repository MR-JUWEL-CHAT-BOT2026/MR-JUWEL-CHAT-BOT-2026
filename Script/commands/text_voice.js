 module.exports.config = {
  name: "text_voice",
  version: "1.0",
  hasPermssion: 0,
  credits: "𝙼𝚘𝚑𝚊𝚖𝚖𝚊𝚍 𝙰𝚔𝚊𝚜𝚑",
  description: "নির্দিষ্ট টেক্সট দিলে কিউট মেয়ের ভয়েস প্লে করবে 😍 (ইমোজি নয়)",
  commandCategory: "noprefix",
  usages: "𝚃𝚎𝚡𝚃",
  cooldowns: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Text অনুযায়ী audio URL
const textAudioMap = {
  "i love you": "https://files.catbox.moe/bx66nu.mp4",
  "আই লাভ ইউ": "https://files.catbox.moe/bpghul.mp4",
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  if (!body) return;

  // ছোট হাতের অক্ষরে রূপান্তর
  const key = body.trim().toLowerCase();

  const audioUrl = textAudioMap[key];
  if (!audioUrl) return; // যদি টেক্সট ম্যাপে না থাকে কিছু হবে না

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const filePath = path.join(cacheDir, `${encodeURIComponent(key)}.mp3`);

  try {
    const response = await axios({
      method: 'GET',
      url: audioUrl,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      api.sendMessage({
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }, messageID);
    });

    writer.on('error', (err) => {
      console.error("Error writing file:", err);
      api.sendMessage("ভয়েস প্লে হয়নি 😅", threadID, messageID);
    });

  } catch (error) {
    console.error("Error downloading audio:", error);
    api.sendMessage("ভয়েস প্লে হয়নি 😅", threadID, messageID);
  }
};

module.exports.run = () => {};
