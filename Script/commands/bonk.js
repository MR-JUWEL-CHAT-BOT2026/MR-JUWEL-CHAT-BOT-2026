const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "bonk",
    aliases: ["b"],
    author: "Meheraz | rewrite by Muzan",
    shortDescription: "Bonk someone",
    longDescription: "Make a BONK meme using two avatars",
    category: "fun",
  },

  circleCrop: async function (buffer, size) {
    const img = await loadImage(buffer);
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, 0, 0, size, size);
    return canvas;
  },

  makeImage: async function (one, two) {
    const bgURL = "https://i.postimg.cc/KYJ0VnK0/image0.png";
    const bg = await loadImage(bgURL);

    const width = 640;
    const height = 480;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, width, height);

    const fetchPfp = async (id) => {
      const url = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      return (await axios.get(url, { responseType: "arraybuffer" })).data;
    };

    const avtOne = await fetchPfp(one);
    const avtTwo = await fetchPfp(two);

    const circle1 = await this.circleCrop(avtOne, 110); // PFP 1 -> size 110
    const circle2 = await this.circleCrop(avtTwo, 90);  // PFP 2 -> size 90

    // Swap positions
    ctx.drawImage(circle1, 60, 150); // Sender goes to hitting position
    ctx.drawImage(circle2, 500, 220);  // Target goes to bonked position

    const outPath = path.join(__dirname, `bonk_${one}_${two}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
    return outPath;
  },

  onStart: async function ({ api, event, args }) {
    try {
      const { threadID, messageID, senderID, mentions, messageReply } = event;

      let targetID;
      if (messageReply?.senderID) targetID = messageReply.senderID;
      else if (Object.keys(mentions).length) targetID = Object.keys(mentions)[0];
      else if (args[0] && /^\d+$/.test(args[0])) targetID = args[0];
      else return api.sendMessage("⚠ Reply / Mention / UID use koro.", threadID, messageID);

      const one = senderID;
      const two = targetID;

      // --- পরিবর্তন এখান থেকে শুরু ---
      // টার্গেট আইডির নাম বের করা হচ্ছে
      let targetName = "User";
      try {
          const userInfo = await api.getUserInfo(targetID);
          targetName = userInfo[targetID].name;
      } catch (e) {
          // যদি নাম না পাওয়া যায়, তাহলে ম্যানশন চেক করবে
          if (Object.keys(mentions).length > 0) {
              targetName = mentions[targetID].replace("@", "");
          }
      }
      // --- পরিবর্তন শেষ ---

      const file = await this.makeImage(one, two);

      api.sendMessage(
        {
          body: `${targetName} bonk nigga 🪓`, // এখানে নাম এবং টেক্সট সেট করা হয়েছে
          attachment: fs.createReadStream(file),
        },
        threadID,
        () => fs.unlinkSync(file),
        messageID
      );
    } catch (err) {
      api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
    }
  },
};
