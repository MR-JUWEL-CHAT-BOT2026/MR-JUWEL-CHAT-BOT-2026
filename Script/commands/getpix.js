const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "getpix",
  version: "1.2",
  hasPermssion: 2,
  credits: "𝐫𝐗",
  description: "Download and send video from Pixeldrain using file ID (auto unsent after 5 min)",
  commandCategory: "media",
  usages: "[fileID]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const fileID = args[0];
  if (!fileID) {
    return api.sendMessage("Type pixlist to see many IDs, then choose one and use it like: !getpix abc123", event.threadID, event.messageID);
  }

  const downloadURL = `https://pixeldrain.com/api/file/${fileID}?download`;
  const cacheDir = path.join(__dirname, "cache");
  const filePath = path.join(cacheDir, `${fileID}.mp4`);

  try {
    await fs.ensureDir(cacheDir);

    // Step 1: Send "retrieving" message
    api.sendMessage("⏳ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭...", event.threadID, async (err, info) => {
      if (err) return;

      try {
        const response = await axios({
          url: downloadURL,
          method: "GET",
          responseType: "stream"
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        writer.on("finish", () => {
          // Step 2: Unsend the "retrieving" message
          api.unsendMessage(info.messageID);

          // Step 3: Send actual video
          api.sendMessage({
            body: `𝐚𝐮𝐭𝐨 𝐮𝐧𝐬𝐞𝐧𝐭 𝐢𝐧 𝟓 𝐦𝐢𝐧𝐮𝐭𝐞 ✨ 𝐞𝐧𝐣𝐨𝐲 𝐭𝐡𝐞 𝐯𝐢𝐝𝐞𝐨`,
            attachment: fs.createReadStream(filePath)
          }, event.threadID, (err, sentInfo) => {
            fs.unlinkSync(filePath);
            if (!err) {
              // Step 4: Auto unsend after 5 minutes
              setTimeout(() => {
                api.unsendMessage(sentInfo.messageID);
              }, 5 * 60 * 1000); // 5 minutes
            }
          }, event.messageID);
        });

        writer.on("error", (error) => {
          console.error(error);
          api.unsendMessage(info.messageID);
          api.sendMessage("❌ Error saving the video file.", event.threadID, event.messageID);
        });

      } catch (downloadErr) {
        console.error(downloadErr.message);
        api.unsendMessage(info.messageID);
        api.sendMessage("❌ Failed to download the video. Please check the file ID.", event.threadID, event.messageID);
      }
    });

  } catch (error) {
    console.error(error.message);
    api.sendMessage("❌ An error occurred while preparing the video.", event.threadID, event.messageID);
  }
};
