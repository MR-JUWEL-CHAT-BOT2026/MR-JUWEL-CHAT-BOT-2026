const axios = require("axios");

const apiKey = "11379c5d-5de2-42b5-b1e2-8a378e3c2812";
const dataFile = __dirname + "/sentVideo.json";

// Helper to read/write sent list
const fs = require("fs");
function loadSentList() {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}
function saveSentList(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data));
}

module.exports.config = {
  name: "getvideo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "rX Abdullah",
  description: "Send random pixeldrain video",
  commandCategory: "media",
  usages: "",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  try {
    const res = await axios.get(`https://pixeldrain.com/api/user/files`, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const allVideos = res.data.files.filter(file => file.mime_type.includes("video"));
    if (allVideos.length === 0) return api.sendMessage("❌ No videos found in your Pixeldrain account.", event.threadID);

    const sentList = loadSentList();

    // Filter out already sent videos
    const unsentVideos = allVideos.filter(file => !sentList.includes(file.id));
    if (unsentVideos.length === 0) {
      saveSentList([]); // reset sent list
      return api.sendMessage("✅ All videos already sent. Resetting the list. Try again.", event.threadID);
    }

    // Pick a random one
    const randomVideo = unsentVideos[Math.floor(Math.random() * unsentVideos.length)];
    const videoUrl = `https://pixeldrain.com/api/file/${randomVideo.id}`;

    const msg = {
      body: `🎬 Here's your random video`,
      attachment: await global.utils.getStreamFromURL(videoUrl)
    };

    api.sendMessage(msg, event.threadID, () => {
      sentList.push(randomVideo.id);
      saveSentList(sentList);
    });

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Failed to fetch video.", event.threadID);
  }
};
