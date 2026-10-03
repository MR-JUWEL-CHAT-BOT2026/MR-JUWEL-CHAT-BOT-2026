const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "helpall",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "乛 MR ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Beautiful all command list with serial numbers",
  commandCategory: "system",
  usages: "[No args]",
  cooldowns: 5
};

// বোল্ড ফন্ট কনভার্ট ফাংশন
function toBold(text) {
  const map = {
    'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄',
    'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
    'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎',
    'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
    'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘',
    'Z': '𝐙', 'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝',
    'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢',
    'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧',
    'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬',
    't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱',
    'y': '𝐲', 'z': '𝐳'
  };
  return text.split('').map(char => map[char] || char).join('');
}

// সিরিয়াল নম্বর বোল্ড করার ফাংশন
function toBoldNumber(num) {
  const boldNumbers = {
    '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒',
    '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
  };
  return num.toString().split('').map(d => boldNumbers[d] || d).join('');
}

// 🔥 প্রধান ফাংশন
async function sendHelp(api, event) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const allCommands = [...commands.keys()]
    .filter(cmd => cmd && cmd.trim() !== "")
    .map(cmd => cmd.trim())
    .sort();

  // 🔥 সিরিয়াল নাম্বার সহ কমান্ড লিস্ট তৈরি
  const commandList = allCommands.map((cmd, index) => {
    const serial = toBoldNumber(index + 1);
    const paddedSerial = serial.padStart(3, ' ');
    return `│ ${paddedSerial} ཐི༏ཋྀ ${toBold(cmd)}`;
  }).join("\n");

  const finalText = `
╔══════════════════════╗
║     ✿ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 ✿     
╚══════════════════════╝

╭──────────────────────╮
${commandList}
╰──────────────────────╯

╔══════════════════════╗
║   ✦ 𝐓𝐨𝐭𝐚𝐥: ${toBoldNumber(allCommands.length)} 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 ✦  
╚══════════════════════╝
`;

  const imgPath = __dirname + "/cache/helpallbg.jpg";
  const bg = "https://i.imgur.com/SHmIpOn.jpeg";

  try {
    const res = await axios({
      url: encodeURI(bg),
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const writer = fs.createWriteStream(imgPath);
    res.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: finalText,
          attachment: fs.createReadStream(imgPath)
        },
        threadID,
        () => {
          try { fs.unlinkSync(imgPath); } catch(e) {}
        },
        messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage(finalText, threadID, messageID);
    });

  } catch (error) {
    console.error("Error:", error);
    api.sendMessage(finalText, threadID, messageID);
  }
}

// 🔥 প্রিফিক্স কমান্ড
module.exports.run = async function ({ api, event }) {
  return sendHelp(api, event);
};

// 🔥 নো-প্রিফিক্স ট্রিগার
module.exports.handleEvent = async function ({ api, event }) {
  const msg = (event.body || "").toLowerCase();

  if (msg === "helpall" || msg === "allcmd") {
    return sendHelp(api, event);
  }
};
