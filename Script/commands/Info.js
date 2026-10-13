module.exports.config = {
  name: "info",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  description: "Bot information command",
  commandCategory: "For users",
  hide: true,
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
  const { threadID } = event;
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];

  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  const { commands } = global.client;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : config.PREFIX;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const msg = `
╔══════════════════════╗
   🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 🤖
╚══════════════════════╝

┌──────────────────────
│ 🏷️ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲    :  𝐑𝐈𝐘𝐀
│ ⚡ 𝗣𝗿𝗲𝗳𝗶𝘅      :  ${config.PREFIX}
│ 📌 𝗕𝗼𝘅 𝗣𝗿𝗲𝗳𝗶𝘅  :  ${prefix}
│ 🧩 𝗠𝗼𝗱𝘂𝗹𝗲𝘀     :  ${commands.size}
│ 📡 𝗣𝗶𝗻𝗴        :  ${Date.now() - event.timestamp}ms
└──────────────────────

╔══════════════════════╗
   👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 👑
╚══════════════════════╝

┌──────────────────────
│ 💎 𝗡𝗮𝗺𝗲     :  乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
│ 🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 :  fb.com/mrjuwel444
│ 💬 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿:  m.me/mrjuwel444
│ 📱 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 :  +8801943488192
└──────────────────────

╔══════════════════════╗
   📊 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐈𝐄𝐒 📊
╚══════════════════════╝

┌──────────────────────
│ ⏱️ 𝗔𝗰𝘁𝗶𝘃𝗲 𝗧𝗶𝗺𝗲 :  ${hours}h ${minutes}m ${seconds}s
│ 👥 𝗚𝗿𝗼𝘂𝗽𝘀      :  ${totalThreads}
│ 🧿 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀:  ${totalUsers}
└──────────────────────

╭━━━━━━━━━━━━━━━━━━━━━╮
   ❤️ 𝐓𝐡𝐚𝐧𝐤𝐬 𝐅𝐨𝐫 𝐔𝐬𝐢𝐧𝐠 ❤️
      🌺 𝐑𝐈𝐘𝐀 𝐁𝐎𝐓 🌺
╰━━━━━━━━━━━━━━━━━━━━━╯

⚙️ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 : 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
`;

  const imgLinks = [
    "https://i.imgur.com/HMtGAMO.jpeg",
  ];

  const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];
  const cachePath = __dirname + "/cache/info.jpg";

  const callback = () => {
    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(cachePath),
      },
      threadID,
      () => fs.unlinkSync(cachePath)
    );
  };

  return request(encodeURI(imgLink))
    .pipe(fs.createWriteStream(cachePath))
    .on("close", callback);
};

// 🔒 Credits Protection
if (module.exports.config.credits !== "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐") {
  throw new Error("⚠️ Credits পরিবর্তন করা হয়েছে! অনুগ্রহ করে আসল ক্রেডিট ব্যবহার করুন।");
}
