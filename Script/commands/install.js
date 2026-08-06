const axios = require("axios");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

module.exports.config = {
  name: "install",
  version: "2.0.0",
  hasPermission: 2,
  credits: "MR JUWEL",
  usePrefix: true,
  description: "Install/Overwrite JS file + Auto Reload + Permission Lock",
  commandCategory: "utility",
  usages: "[file name] [link/code]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  try {

    // 🔒 Bot Admin Only Permission
    if (!global.config.ADMINBOT.includes(event.senderID)) {
      return api.sendMessage(
        `╔══════════════════════╗ ❌ শুধুমাত্র বট এডমিন install করতে পারবে! ╚══════════════════════╝`,
        event.threadID,
        event.messageID
      );
    }

    const fileName = args[0];
    const input = args.slice(1).join(" ");

    if (!fileName || !input) {
      return api.sendMessage(
        `╔══════════════════════╗ ⚠️ ফাইল নাম + কোড/লিংক দিন! ╚══════════════════════╝`,
        event.threadID,
        event.messageID
      );
    }

    // ❌ invalid name
    if (fileName.includes("..") || path.isAbsolute(fileName)) {
      return api.sendMessage(
        `╔══════════════════════╗ ❌ অবৈধ ফাইল নাম! ╚══════════════════════╝`,
        event.threadID,
        event.messageID
      );
    }

    // ❌ only js
    if (!fileName.endsWith(".js")) {
      return api.sendMessage(
        `╔══════════════════════╗ ⚠️ শুধুমাত্র .js ফাইল! ╚══════════════════════╝`,
        event.threadID,
        event.messageID
      );
    }

    let code;
    const isLink = /^(http|https):\/\/[^ "]+$/.test(input);

    // 🌐 fetch code
    if (isLink) {
      try {
        const res = await axios.get(input);
        code = res.data;
      } catch (e) {
        return api.sendMessage(
          `╔══════════════════════╗ ❌ লিংক থেকে কোড আনতে সমস্যা! ╚══════════════════════╝`,
          event.threadID,
          event.messageID
        );
      }
    } else {
      code = input;
    }

    // ✅ Syntax Check
    try {
      new vm.Script(code);
    } catch (err) {
      return api.sendMessage(
        `╔══════════════════════╗ ❌ Syntax Error: ${err.message} ╚══════════════════════╝`,
        event.threadID,
        event.messageID
      );
    }

    const filePath = path.join(__dirname, fileName);

    // 🔁 overwrite or create
    let status = "✅ নতুন ফাইল তৈরি হয়েছে!";
    if (fs.existsSync(filePath)) {
      status = "♻️ ফাইল আপডেট হয়েছে!";
    }

    fs.writeFileSync(filePath, code, "utf-8");

    // ⚡ AUTO RELOAD SYSTEM
    let fileInfo = "";

    try {
      const commandName = fileName.replace(".js", "");

      delete require.cache[require.resolve(filePath)];

      const newCommand = require(filePath);

      global.client.commands.delete(commandName);
      global.client.commands.set(commandName, newCommand);

      // ⭐ FILE INFO FEATURE
      const c = newCommand.config || {};

      fileInfo =
        `╭━━━〔 ⚙️ FILE INFO 〕━━━╮\n` +
        `┃ 📌 Name : ${c.name || fileName}\n` +
        `┃ 👑 Author : ${c.credits || "Unknown"}\n` +
        `┃ ⚙️ Version : ${c.version || "1.0.0"}\n` +
        `┃ 🔒 Permission : ${c.hasPermission ?? c.hasPermssion ?? "N/A"}\n` +
        `┃ ⏱ Cooldown : ${c.cooldowns || 0}s\n` +
        `┃ 📦 Dependencies : ${(Object.keys(c.dependencies || {}).join(", ") || "None")}\n` +
        `╰━━━━━━━━━━━━━━━━━━━╯`;

    } catch (reloadErr) {
      return api.sendMessage(
        `╔══════════════════════╗ ⚠️ ফাইল সেভ হয়েছে কিন্তু reload fail! ${reloadErr.message} ╚══════════════════════╝`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      `╔══════════════════════╗ ${status} 📂 ${fileName} ⚡ Auto Reload Complete! ╚══════════════════════╝\n\n${fileInfo}`,
      event.threadID,
      event.messageID
    );

  } catch (err) {
    console.error(err);
    return api.sendMessage(
      `╔══════════════════════╗ ❌ Unexpected Error! ╚══════════════════════╝`,
      event.threadID,
      event.messageID
    );
  }
};
