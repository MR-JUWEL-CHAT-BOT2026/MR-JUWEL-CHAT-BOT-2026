const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "salam",
  version: "5.2",
  hasPermssion: 0,
  credits: "MR JUWEL",
  description: "Auto reply Wa Alaikum Assalam with profile picture",
  commandCategory: "noprefix",
  usages: "assalamu alaikum",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  // bot ignore
  if (senderID === api.getCurrentUserID()) return;

  const salamWords = [
    "assalamu alaikum",
    "assalamualaikum",
    "আসসালামু আলাইকুম",
    "আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ আ্ঁলা্ঁই্ঁকু্ঁম্ঁ"
  ];

  const msg = body.toLowerCase();
  if (!salamWords.some(w => msg.includes(w))) return;

  try {
    const name = await Users.getNameUser(senderID);

    // profile picture
    const profilePicUrl = `https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgPath = path.join(cacheDir, `${senderID}.jpg`);
    const img = (await axios.get(profilePicUrl, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(imgPath, img);

    const replyMsg =
`╔═══════════════╗
ও্ঁয়া্ঁলা্ঁই্ঁকু্ঁম্ঁ 🌷 আ্ঁস্ঁসা্ঁলা্ঁম্ঁ
𝐖𝐀𝐀𝐋𝐀𝐈𝐊𝐔𝐌🌷𝐀𝐒𝐒𝐀𝐋𝐀𝐌
👥 ${name}
╚═══════════════╝`;

    return api.sendMessage(
      {
        body: replyMsg,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.existsSync(imgPath) && fs.unlinkSync(imgPath),
      messageID
    );

  } catch (err) {
    console.error("❌ Salam Error:", err);
  }
};

module.exports.run = () => {};
