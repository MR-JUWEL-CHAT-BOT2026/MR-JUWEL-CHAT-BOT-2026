
const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

let lastPlayed = -1;

module.exports.config = {
  name: "gan",
  version: "1.1.0",
  hasPermission: 0,
  credits: "MR JUWEL (No Prefix by ChatGPT)",
  description: "Play random song without prefix",
  commandCategory: "music",
  usages: "gan",
  cooldowns: 5,
};

async function playSong(api, event) {
  const { threadID, messageID } = event;

  const songLinks = [
    "https://files.catbox.moe/etsdn9.mp3",
    "https://files.catbox.moe/ayepdz.mp3",
    "https://files.catbox.moe/oaecnx.mp3",
    "https://files.catbox.moe/xtpf61.mp3",
    "https://files.catbox.moe/12grz0.mp3",
    "https://files.catbox.moe/aaqddo.mp3",
    "https://files.catbox.moe/k3acvx.mp3",
    "https://files.catbox.moe/nry1qv.mp3",
    "https://files.catbox.moe/23e8u1.mp3",
    "https://files.catbox.moe/y8dzik.mp3",
    "https://files.catbox.moe/z9d2e6.mp3",
    "https://files.catbox.moe/0xscc8.mp3",
    "https://files.catbox.moe/q4m2ad.mp3",
    "https://files.catbox.moe/y8bg4r.mp3",
    "https://files.catbox.moe/q61co1.mp3",
    "https://files.catbox.moe/euq7fo.mp3",
    "https://files.catbox.moe/x5f56o.mp3",
    "https://files.catbox.moe/avlqok.mp3",
    "https://files.catbox.moe/v0twt3.mp3",
    "https://files.catbox.moe/qmpvpt.mp3",
    "https://files.catbox.moe/wrdtb0.mp3",
    "https://files.catbox.moe/s4bzr8.mp3",
    "https://files.catbox.moe/4m5z15.mp3",
    "https://files.catbox.moe/i6v5xj.mp3",
    "https://files.catbox.moe/7tz9ts.mp3",
    "https://files.catbox.moe/mdh4rg.mp3",
    "https://files.catbox.moe/aa643l.mp3",
    "https://files.catbox.moe/ih48ki.mp3",
    "https://files.catbox.moe/gvvb82.mp3",
    "https://files.catbox.moe/tht37y.mp3",
    "https://files.catbox.moe/bmk3mq.mp3",
    "https://files.catbox.moe/9i3g65.mp3",
    "https://files.catbox.moe/ap2yed.mp3",
  ];

  // 🎵 Reaction
  api.setMessageReaction("🎶", messageID, () => {}, true);

  // 🎲 Random (no repeat)
  let index;
  do {
    index = Math.floor(Math.random() * songLinks.length);
  } while (index === lastPlayed && songLinks.length > 1);
  lastPlayed = index;

  const songNumber = index + 1;
  const url = songLinks[index];

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const filePath = path.join(
    cacheDir,
    `gan_${songNumber}_${Date.now()}.mp3`
  );

  try {
    const res = await axios({
      url,
      method: "GET",
      responseType: "stream",
      timeout: 30000
    });

    const writer = fs.createWriteStream(filePath);
    res.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body:
`🎧 𝗥𝗮𝗻𝗱𝗼𝗺 𝗦𝗼𝗻𝗴

🎵 Song No: ${songNumber}/${songLinks.length}
🔀 Mode: No Prefix

Enjoy 🎶`,
          attachment: fs.createReadStream(filePath)
        },
        threadID,
        () => {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
      );
    });

  } catch (e) {
    api.sendMessage("❌ গান পাঠাতে সমস্যা হয়েছে!", threadID);
  }
}

/**
 * 🔥 NO PREFIX HANDLER
 * শুধু "gan" লিখলেই কাজ করবে
 */
module.exports.handleEvent = async function ({ api, event }) {
  if (!event.body) return;

  const msg = event.body.trim().toLowerCase();
  if (msg === "gan") {
    return playSong(api, event);
  }
};

/**
 * 🔹 Prefix দিয়েও কাজ করবে (optional)
 */
module.exports.run = async function ({ api, event }) {
  return playSong(api, event);
};
