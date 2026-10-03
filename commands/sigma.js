const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "sigma",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝐒𝐡𝐚𝐨𝐧 𝐀𝐡𝐞𝐦𝐞𝐝 (Fixed by ChatGPT)",
  description: "Sigma Attitude Video",
  commandCategory: "Video",
  usages: "sigma",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event }) => {
  try {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const videoPath = path.join(cacheDir, "sigma.mp4");

    const captions = [
      "𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 𝐕𝐈𝐃𝐄𝐎 😇\n𝗬𝗼𝘂𝗥 𝗙𝗮𝘃𝗼𝘂𝗿𝗶𝘁𝗲 𝗦𝗔 𝗛𝗨"
    ];

    const links = [
      "https://drive.google.com/uc?id=11dUXILgge35GyV9ilD_JmzLiL7yq5WMc",
      "https://drive.google.com/uc?id=11Wr0yQ3QVG1BucbdlANkSo5vE-a___Sn",
      "https://drive.google.com/uc?id=10e1TdrCvj0w2GIBrczbQYUFvb5HddTaW",
      "https://drive.google.com/uc?id=114eZDQU1xbBa2BKrfaboA8tQlJi2fWcS",
      "https://drive.google.com/uc?id=11x0wO9uv9foBrq0B585QEVTk1h0Ci6L_"
    ];

    const videoURL = links[Math.floor(Math.random() * links.length)];
    const caption = captions[Math.floor(Math.random() * captions.length)];

    const response = await axios.get(videoURL, {
      responseType: "stream"
    });

    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: `「 ${caption} 」`,
          attachment: fs.createReadStream(videoPath)
        },
        event.threadID,
        () => fs.unlinkSync(videoPath)
      );
    });

  } catch (err) {
    api.sendMessage("❌ Sigma ভিডিও পাঠাতে সমস্যা হয়েছে!", event.threadID);
    console.error(err);
  }
};
