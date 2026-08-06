const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MR JUWEL", //don't change my credit 
    description: "Show Owner Info",
    commandCategory: "noprefix",
    usages: "",
    cooldowns: 5
};

// ✅ NO PREFIX TRIGGER
module.exports.handleEvent = async function ({ api, event }) {
    if (!event.body) return;

    const msg = event.body.toLowerCase().trim();
    if (msg === "admin") {
        return module.exports.run({ api, event });
    }
};

module.exports.run = async function ({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    if (!fs.existsSync(__dirname + "/cache")) {
        fs.mkdirSync(__dirname + "/cache");
    }

    var callback = () => api.sendMessage({
        body: `
┣━━━━━━━━━━━━━━━┫
┃
┃—͟͟͞͞─⃞⤹🩷ꤪ🅐🅓🅜🅘🅝⤸⃞🩷ꤪꜛ國🪽
┃
┣━━━━━━━━━━━━━━━┫
┃
┃👤 𝐍𝐚𝐦𝐞          〲 𝐉𝆠፝֟𝐔𝆠፝֟𝐖𝆠፝֟𝐄𝆠፝֟𝐋 
┃   
┣━━━━━━━━━━━━━━━┫
┃
┃𝐍𝐢𝐜𝐤 𝐍𝐚𝐦𝐞〲𝐌𝆠፝֟𝐑 𝐉𝆠፝֟𝐔𝆠፝֟𝐖𝆠፝֟𝐄𝆠፝֟𝐋
┃
┣━━━━━━━━━━━━━━━┫
┃
┃ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫      〲 𝐌𝐀𝐋𝐄  
┃  
┣━━━━━━━━━━━━━━━┫
┃
┃ 😈𝐀𝐓𝐓𝐈𝐓𝐔𝐃𝐄 〲𝐊𝐈𝐍𝐆   
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🎮𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄〲𝐋𝐎𝐕𝐄𝐑
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🎓𝐏𝐑𝐀𝐒𝐔𝐍𝐀〲𝐎𝐅𝐅
┃
┣━━━━━━━━━━━━━━━┫
┃
┃💰𝐖𝐨𝐫𝐤〲𝐂𝐎𝐍𝐓𝐑𝐀𝐂𝐓𝐈𝐎𝐍
┃
┣━━━━━━━━━━━━━━━┫
┃
┃❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧  〲𝐒𝐈𝐍𝐆𝐄𝐋
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🎂 𝐀𝐠𝐞          〲𝟐𝟐+
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🎂𝐁𝐢𝐫𝐭𝐡𝐝𝐚𝐲 〲𝐀𝐏𝐑𝐈𝐋 𝟐𝟒
┃
┣━━━━━━━━━━━━━━━┫
┃
┃ 🩸𝐁𝐥𝐨𝐝        〲𝐀+ 
┃
┣━━━━━━━━━━━━━━━┫
┃
┃ 🙆‍♂️𝐇𝐈𝐆𝐇𝐓〲𝟓"𝟔
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🧍𝐖𝐈𝐈𝐓〲𝟓𝟒+
┃
┣━━━━━━━━━━━━━━━┫
┃
┃ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧 〲𝐈𝐒𝐋𝐀𝐌
┃
┣━━━━━━━━━━━━━━━┫
┃
┃ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬〲𝐑𝐀𝐍𝐆𝐏𝐔𝐑
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🌐𝐌𝐞𝐬𝐬𝐞𝐧𝐠𝐞𝐫 ❯ mrjuwel999
┃ 
┣━━━━━━━━━━━━━━━┫
┃
┃🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤❯ fb.com/mrjuwel999
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🌐𝐖𝐡𝐚𝐭𝐬𝐚𝐩𝐩❯ +8801943488192
┃ 
┣━━━━━━━━━━━━━━━┫
┃
┃🌐𝐈𝐍𝐒𝐓𝐀𝐆𝐑𝐀𝐌❯ mrjuwel_2025
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🌐 𝐓𝐢𝐤𝐭𝐨𝐤❯ mrjuwel2025
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🌐 𝐓𝐞𝐥𝐞𝐠𝐫𝐚𝐦❯ mrjuwel2025
┃
┣━━━━━━━━━━━━━━━┫
┃
┃🌐 𝐄𝐦𝐚𝐢𝐥❯ mrjuwel315@gmail.com 
┃
┣━━━━━━━━━━━━━━━┫
┃
┃ 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐓𝐢𝐦𝐞:  ${time}
┃
┗━━━━━━━━━━━━━━━┛
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));

    const imageURL = "https://i.imgur.com/C7JxBBW.jpeg";

    return request(encodeURI(imageURL))
        .pipe(fs.createWriteStream(__dirname + "/cache/1.png"))
        .on("close", () => callback());
};
