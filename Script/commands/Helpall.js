const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "helpall",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Displays all available commands in one beautiful page",
  commandCategory: "system",
  usages: "[No args]",
  cooldowns: 5
};

// 🔤 Normal → 𝙰𝙱𝙲𝙳 (Mathematical Monospace) Converter
function toABCD(text) {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const nums  = "0123456789";

  const upperMap = "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉";
  const lowerMap = "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣";
  const numMap   = "𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿";

  return text
    .split("")
    .map(ch => {
      let i = upper.indexOf(ch);
      if (i > -1) return upperMap[i];

      i = lower.indexOf(ch);
      if (i > -1) return lowerMap[i];

      i = nums.indexOf(ch);
      if (i > -1) return numMap[i];

      return ch;
    })
    .join("");
}

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

  // 🔢 ০১ ০২ ০৩ সিরিয়াল + 𝙰𝙱𝙲𝙳 ফন্ট
  const cmdList = allCommands
    .map((cmd, i) => {
      const serial = (i + 1)
        .toString()
        .padStart(2, "0")
        .replace(/[0-9]/g, d => "০১২৩৪৫৬৭৮৯"[d]);

      return `║ ${serial} ┃ ${toABCD(cmd.toUpperCase())}`;
    })
    .join("\n");

  const finalText = `
╔════════════════════╗
║  ✦ ${toABCD("ALL COMMANDS")} ✦
╚════════════════════╝

┏━━━━━━━━━━━━━━━━━━┓
${cmdList}
┗━━━━━━━━━━━━━━━━━━┛

╔════════════════════╗
║   🔰 ${toABCD("BOT INFO")} 🔰
╠════════════════════╣
║ 🤖 ${toABCD("BOT")}   : 𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐
║ 👑 ${toABCD("OWNER")} : 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
║ 📦 ${toABCD("TOTAL")} : ${toABCD(String(allCommands.length))}
╚═══════════════════╝

   ✨ ${toABCD("TYPE A COMMAND TO START")} ✨
`;

  const backgrounds = [
    "https://i.imgur.com/HMtGAMO.jpeg"
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
