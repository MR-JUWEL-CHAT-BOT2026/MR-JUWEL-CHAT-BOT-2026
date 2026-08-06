module.exports.config = {
  name: "anime",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "ANIME VIDEO WITH PROGRESS LOADING",
  commandCategory: "group",
  usages: "anime",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const fs = global.nodemodule["fs-extra"];
  const axios = require("axios");

  // 🎬 PROGRESS LOADING (OPTION 5)
  const loadingFrames = [
    "[■□□□□] Loading...",
    "[■■□□□] Loading...",
    "[■■■□□] Loading...",
    "[■■■■□] Loading...",
    "[■■■■■] Done!"
  ];

  // 🎥 ALL 20 VIDEOS (UNCHANGED)
  const videoUrls = [
    "https://drive.google.com/uc?id=1gI265E7VL9cdyk6TuuFav2uA1HifQs5Y",
    "https://drive.google.com/uc?id=1gMAKxgOmW8KHCGZHHgdy9oVbAQlwju1R",
    "https://drive.google.com/uc?id=1gSBzIdm6lys5uU25xLfO2eJ2T9j5USqB",
    "https://drive.google.com/uc?id=1gT7IaIa7OGZ6DqFaIkZ9wDInscdPM19i",
    "https://drive.google.com/uc?id=1gZ_yXg7-nhugrDFRu3eod7WkqdRx7__z",
    "https://drive.google.com/uc?id=1g_W88siZAAa9t0dfoh4MN_yS1EZi6LES",
    "https://drive.google.com/uc?id=1gagkI-OzhhFp96lgu92zFUe7eRfI-HYB",
    "https://drive.google.com/uc?id=1gaz8T8mZ5I9wjnEkalM_YWe0RKjSjHon",
    "https://drive.google.com/uc?id=1ghSYY81_y75d13dCNVBgsN-KknWFqZPe",
    "https://drive.google.com/uc?id=1grPs_ZOxRLJjeckE_18ufIuXmO4JiqX8",
    "https://drive.google.com/uc?id=1h2LUncQ1EY-qPpvu3jBoIwYpzkcCT3-f",
    "https://drive.google.com/uc?id=1h7wXAn7UCoGjki__OC3KCe7P5YtkSL5",
    "https://drive.google.com/uc?id=1i67IloPzLl4sm1M_-pYF27fmO7ietqwF",
    "https://drive.google.com/uc?id=1oRSrxjBy3TpoJuqvLlr2G-rarEXmpfqb",
    "https://drive.google.com/uc?id=1o_52X4nBwE-ZhNBoELquEpJVNt8s4Nlw",
    "https://drive.google.com/uc?id=1oZYPzoa-nrv86wcHLYJCKDgxyB0WoBlB",
    "https://drive.google.com/uc?id=1oTXBxT0Wgk4fn92lZQww34aPyIOw4JsL",
    "https://drive.google.com/uc?id=1oUECTBiTT4oOV-fIeRCIngN0RDgHYynY",
    "https://drive.google.com/uc?id=1oZDfbjwKAZ8qzy1oOp9bwN6LZfNrWhR9",
    "https://drive.google.com/uc?id=1oJzK17HPM4kWbz4PCmTCZ0Js3dZRoTVI"
  ];

  const msg = "☆《ANIME VIDEO》☆";
  const url = videoUrls[Math.floor(Math.random() * videoUrls.length)];
  const path = __dirname + `/cache/anime_${Date.now()}.mp4`;

  // ⏳ SEND INITIAL MESSAGE
  let i = 0;
  const loadingMsg = await api.sendMessage("⏳ Preparing Anime...", event.threadID);

  // 🔄 PROGRESS LOOP
  const loadingInterval = setInterval(() => {
    api.editMessage(loadingFrames[i % loadingFrames.length], loadingMsg.messageID);
    i++;
  }, 600);

  try {
    const response = await axios({
      method: "GET",
      url,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    writer.on("finish", () => {
      clearInterval(loadingInterval);

      api.sendMessage({
        body: `「 ${msg} 」`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => {
        fs.unlinkSync(path);
      });
    });

    writer.on("error", () => {
      clearInterval(loadingInterval);
      api.sendMessage("❌ ভিডিও লোড করতে সমস্যা হয়েছে", event.threadID);
      fs.unlinkSync(path);
    });

  } catch (e) {
    clearInterval(loadingInterval);
    api.sendMessage("⚠️ সার্ভার সমস্যা", event.threadID);
  }
};
