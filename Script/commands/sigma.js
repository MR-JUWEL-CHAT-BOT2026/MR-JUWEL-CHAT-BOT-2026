const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const CREDIT = "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐";

module.exports.config = {
  name: "sigma",
  version: "1.2.0",
  hasPermssion: 0,
  credits: CREDIT, // ফিক্স: আগে কোটেশন ছাড়া ছিল, তাই Syntax Error হতো
  description: "Sigma Attitude Video",
  commandCategory: "Video",
  usages: "sigma",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

const LINKS = [
  "https://i.imgur.com/8sHM2J9.mp4",
  "https://i.imgur.com/0T0g9FM.mp4",
  "https://i.imgur.com/MpbxZ6H.mp4",
  "https://i.imgur.com/QBPgnPo.mp4",
  "https://i.imgur.com/p8hsZGn.mp4",
  "https://i.imgur.com/PMRxDxn.mp4",
  "https://i.imgur.com/5xoQ2BX.mp4",
  "https://i.imgur.com/awQDVnp.mp4",
  "https://i.imgur.com/oASqo3W.mp4",
  "https://i.imgur.com/91iwAjC.mp4",
  "https://i.imgur.com/nhIyCLK.mp4",
  "https://i.imgur.com/QDZrSQe.mp4",
  "https://i.imgur.com/jzsPtVU.mp4",
  "https://i.imgur.com/2q4zxkb.mp4",
  "https://i.imgur.com/QwirofD.mp4",
  "https://i.imgur.com/aLTUk1s.mp4",
  "https://i.imgur.com/pAWp7pZ.mp4",
  "https://i.imgur.com/Wdm7cEy.mp4",
  "https://i.imgur.com/wlODXWS.mp4",
  "https://i.imgur.com/Gl1FKx8.mp4",
  "https://i.imgur.com/AK1slO1.mp4",
  "https://i.imgur.com/cVozsr0.mp4",
  "https://i.imgur.com/wWB16bB.mp4",
  "https://i.imgur.com/6j38Yae.mp4",
  "https://i.imgur.com/bmh61Gw.mp4",
  "https://i.imgur.com/MvFLaMG.mp4",
  "https://i.imgur.com/VD5DHR0.mp4",
  "https://i.imgur.com/0VtAZEy.mp4",
  "https://i.imgur.com/tlmdTK5.mp4",
  "https://i.imgur.com/jrYsuf3.mp4"
];

const MOODS = [
  "Attitude Mode 😎",
  "Savage Vibes 🔥",
  "Silent Killer 🖤",
  "Lone Wolf 🐺",
  "King Mindset 👑"
];

const MAX_SIZE = 25 * 1024 * 1024; // Messenger লিমিট ~25MB
const MAX_TRIES = 3;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildCaption(index, total) {
  return [
    "╭━━━━━━━━━━━━━━━━━━╮",
    "   😈  𝐒𝐈𝐆𝐌𝐀  𝐕𝐈𝐃𝐄𝐎  😈",
    "╰━━━━━━━━━━━━━━━━━━╯",
    "",
    `🎬 ভিডিও  : ${index}/${total}`,
    `⚡ মুড       : ${pick(MOODS)}`,
    "",
    "┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈",
    `👑 ${CREDIT}`
  ].join("\n");
}

function download(url, dest) {
  return axios({
    url,
    method: "GET",
    responseType: "stream",
    timeout: 20000,
    maxContentLength: MAX_SIZE
  }).then(
    (res) =>
      new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(dest);
        res.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
        res.data.on("error", reject);
      })
  );
}

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  const cacheDir = path.join(__dirname, "cache");
  fs.ensureDirSync(cacheDir);

  // প্রতিবার আলাদা ফাইল নাম, যাতে একসাথে অনেকে ব্যবহার করলে ফাইল মিশে না যায়
  const videoPath = path.join(cacheDir, `sigma_${Date.now()}_${threadID}.mp4`);

  const cleanup = () => {
    try {
      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    } catch (e) {
      console.error("[sigma] cleanup error:", e.message);
    }
  };

  const waitMsg = await new Promise((resolve) =>
    api.sendMessage("⏳ Sigma ভিডিও লোড হচ্ছে, একটু অপেক্ষা করো...", threadID, (err, info) =>
      resolve(err ? null : info)
    )
  );

  // ভিডিও ডাউনলোড না হলে অন্য লিংক দিয়ে আবার চেষ্টা করবে
  const pool = [...LINKS].sort(() => Math.random() - 0.5).slice(0, MAX_TRIES);
  let usedUrl = null;

  for (const url of pool) {
    try {
      await download(url, videoPath);
      const size = fs.statSync(videoPath).size;
      if (size > 0 && size <= MAX_SIZE) {
        usedUrl = url;
        break;
      }
      cleanup();
    } catch (err) {
      console.error(`[sigma] download failed (${url}):`, err.message);
      cleanup();
    }
  }

  if (waitMsg && waitMsg.messageID) {
    try { api.unsendMessage(waitMsg.messageID); } catch (e) {}
  }

  if (!usedUrl) {
    return api.sendMessage(
      `❌ Sigma ভিডিও পাঠাতে সমস্যা হয়েছে!\nআবার চেষ্টা করো।\n\n👑 ${CREDIT}`,
      threadID,
      messageID
    );
  }

  const caption = buildCaption(LINKS.indexOf(usedUrl) + 1, LINKS.length);

  api.sendMessage(
    {
      body: caption,
      attachment: fs.createReadStream(videoPath)
    },
    threadID,
    (err) => {
      if (err) console.error("[sigma] send error:", err);
      cleanup();
    },
    messageID
  );
};
