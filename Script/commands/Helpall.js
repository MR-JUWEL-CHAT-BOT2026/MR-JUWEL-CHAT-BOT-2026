const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "helpall",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MR JUWEL",
  description: "Displays all available commands in one beautiful page",
  commandCategory: "system",
  usages: "[No args]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const allCommands = [];

  for (let [name] of commands) {
    if (name && name.trim() !== "") {
      allCommands.push(name.trim());
    }
  }

  allCommands.sort();

  const finalText = `
╭━━━━━━━━━━━━━━━╮
┃🌸𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒🌸  
╰━━━━━━━━━━━━━━━╯

╔══════════════╗
${allCommands.map(cmd => `║ 🔹 ${cmd}`).join("\n")}
╚══════════════╝

╭━━🔰 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 🔰━━╮
┃ 🤖 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞 : 𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐
┃ 👑 𝐎𝐰𝐧𝐞𝐫   : 𓆩꯭𝆺𝅥😻⃞𝐌⃞𝆠፝֟𝐑᭄ღ倫 𝐉⃞𝐔⃞𝐖⃞𝐄⃞𝐋༢࿐
┃ 📦 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 : ${allCommands.length}
╰━━━━━━━━━━━━━━━━╯

✨ 𝐓𝐲𝐩𝐞 𝐚 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐭𝐨 𝐆𝐞𝐭 𝐒𝐭𝐚𝐫𝐭𝐞𝐝 ✨
`;

  const backgrounds = [
    "https://i.imgur.com/x1lGwuM.jpeg"
  ];

  const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const imgPath = __dirname + "/cache/helpallbg.jpg";

  const send = () => {
    api.sendMessage(
      {
        body: finalText,
        attachment: fs.createReadStream(imgPath)
      },
      threadID,
      () => fs.unlinkSync(imgPath),
      messageID
    );
  };

  request(encodeURI(selectedBg))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", send);
};
