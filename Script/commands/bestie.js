module.exports.config = {
  name: "bestie",
  version: "7.3.3",
  hasPermssion: 0,
  credits: "Priyansh Rajput | Fixed by ChatGPT",
  description: "Get Bestie Pair Image From Mention",
  commandCategory: "png",
  usages: "[@mention]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const { downloadFile } = global.utils;

  const dirPath = path.join(__dirname, "cache", "canvas");
  const imgPath = path.join(dirPath, "bestie.png");

  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  if (!fs.existsSync(imgPath)) {
    await downloadFile("https://i.imgur.com/dAxBwKy.jpg", imgPath);
  }
};

async function circle(imgPath) {
  const jimp = global.nodemodule["jimp"];
  const img = await jimp.read(imgPath);
  img.circle();
  return img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const root = path.join(__dirname, "cache", "canvas");
  const bg = await jimp.read(path.join(root, "bestie.png"));

  const avt1 = path.join(root, `avt_${one}.png`);
  const avt2 = path.join(root, `avt_${two}.png`);
  const out = path.join(root, `bestie_${one}_${two}.png`);

  const token = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

  const img1 = (await axios.get(
    `https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`,
    { responseType: "arraybuffer" }
  )).data;

  const img2 = (await axios.get(
    `https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`,
    { responseType: "arraybuffer" }
  )).data;

  fs.writeFileSync(avt1, Buffer.from(img1));
  fs.writeFileSync(avt2, Buffer.from(img2));

  const c1 = await jimp.read(await circle(avt1));
  const c2 = await jimp.read(await circle(avt2));

  bg.composite(c1.resize(191, 191), 93, 111);
  bg.composite(c2.resize(190, 190), 434, 107);

  await bg.writeAsync(out);

  fs.unlinkSync(avt1);
  fs.unlinkSync(avt2);

  return out;
}

module.exports.run = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);

  if (!mention[0]) {
    return api.sendMessage(
      "😅 একজনকে mention কর আগে!",
      threadID,
      messageID
    );
  }

  const imgPath = await makeImage({
    one: senderID,
    two: mention[0]
  });

  api.sendMessage(
    {
      body:
        "✧•❁𝐅𝐫𝐢𝐞𝐧𝐝𝐬𝐡𝐢𝐩❁•✧\n\n" +
        "Successful Pairing 💖\n\n" +
        "👑 YE LE MIL GAI\n" +
        "TERI BESTIE 🩷",
      attachment: fs.createReadStream(imgPath)
    },
    threadID,
    () => fs.unlinkSync(imgPath),
    messageID
  );
};
