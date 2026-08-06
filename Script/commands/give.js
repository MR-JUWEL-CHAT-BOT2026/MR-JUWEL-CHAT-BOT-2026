const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
 name: "give",
 version: "3.4.0",
 hasPermssion: 2,
 credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
 description: "2-step upload UI (animation → file info)",
 commandCategory: "utility",
 usages: "[filename]",
 cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {

 if (!args[0]) {
 return api.sendMessage("❌ ফাইল নাম দাও", event.threadID);
 }

 const fileName = args[0];
 const commandsPath = path.join(__dirname, "..", "commands");

 const filePath1 = path.join(commandsPath, fileName);
 const filePath2 = path.join(commandsPath, fileName + ".js");

 let fileToRead;

 if (fs.existsSync(filePath1)) fileToRead = filePath1;
 else if (fs.existsSync(filePath2)) fileToRead = filePath2;
 else return api.sendMessage("❌ ফাইল পাওয়া যায়নি", event.threadID);

 try {
 const data = fs.readFileSync(fileToRead, "utf8");

 let c = {};
 try {
 delete require.cache[require.resolve(fileToRead)];
 c = require(fileToRead).config || {};
 } catch {}

 const stats = fs.statSync(fileToRead);
 const sizeKB = (stats.size / 1024).toFixed(2);
 const lines = data.split("\n").length;

 // 🌟 STEP 1: ANIMATION
 const frames = [
 "▰▱▱▱▱▱▱▱▱▱ 10%",
 "▰▰▱▱▱▱▱▱▱▱ 20%",
 "▰▰▰▱▱▱▱▱▱▱ 30%",
 "▰▰▰▰▱▱▱▱▱▱ 40%",
 "▰▰▰▰▰▱▱▱▱▱ 50%",
 "▰▰▰▰▰▰▱▱▱▱ 60%",
 "▰▰▰▰▰▰▰▱▱▱ 70%",
 "▰▰▰▰▰▰▰▰▱▱ 80%",
 "▰▰▰▰▰▰▰▰▰▱ 90%",
 "▰▰▰▰▰▰▰▰▰▰ 100% 🚀"
 ];

 let i = 0;

 const msg = await api.sendMessage(
`╔════════════════════╗
║ ⚡ Upload শুরু...
╚════════════════════╝`,
 event.threadID
 );

 const interval = setInterval(() => {
 if (i >= frames.length) return;

 api.editMessage(
`╔════════════════════╗
║ 📤 Uploading...
║ ${frames[i]}
╚════════════════════╝`,
 msg.messageID
 );

 i++;
 }, 300);

 // upload
 const pastebinAPI = "https://pastebin-api.vercel.app";

 const res = await axios.post(`${pastebinAPI}/paste`, {
 text: data
 });

 clearInterval(interval);

 if (!res.data || !res.data.id) {
 return api.editMessage("⚠️ Upload failed", msg.messageID);
 }

 const link = `${pastebinAPI}/raw/${res.data.id}`;

 // ⏳ STEP 1 END (final animation finish)
 await api.editMessage(
`╔════════════════════╗
║ ✅ Upload Complete
║ ▰▰▰▰▰▰▰▰▰▰ 100%
╚════════════════════╝`,
 msg.messageID
 );

 await new Promise(r => setTimeout(r, 1000));

 // 🎯 STEP 2: NEW MESSAGE (FILE INFO + LINK)
 const fileInfo =
`╔════════════════════════╗
║ 📄 ${(c.name || fileName).toUpperCase()} FILE 
╠════════════════════════╣
║ 📌 Name : ${c.name || fileName}
║ 👑 Author : ${c.credits || "Unknown"}
║ ⚙️ Version : ${c.version || "1.0.0"}
║ 🔒 Permission : ${c.hasPermission ?? c.hasPermssion ?? "N/A"}
║ ⏱ Cooldown : ${c.cooldowns || 0}s
║ 📦 Depends : ${(Object.keys(c.dependencies || {}).join(", ") || "None")}
║ 📊 Size : ${sizeKB} KB
║ 📜 Lines : ${lines}
╠════════════════════════╣
║ 🔗 LINK:
║ ${link}
╚════════════════════════╝`;

 return api.sendMessage(fileInfo, event.threadID);

 } catch (err) {
 console.error(err);
 return api.sendMessage("❌ ERROR: " + err.message, event.threadID);
 }
};
