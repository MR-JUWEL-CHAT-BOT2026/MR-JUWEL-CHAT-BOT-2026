const fs = require("fs");
const path = require("path");
const axios = require("axios");

const API_BASE = "https://mirai-store.onrender.com";
const ADMINS = ["61591542717221"];

module.exports.config = {
 name: "miraistore",
 version: "2.0.0",
 hasPermission: 2,
 credits: "MR JUWEL",
 description: "Mirai Command Store (Search, Like, Upload, Delete, Trending)",
 commandCategory: "system",
 usages:
 "!miraistore <id | name | category>\n" +
 "!miraistore like <id>\n" +
 "!miraistore trending\n" +
 "!miraistore upload <commandName>\n" +
 "!miraistore delete <id> <secret>",
 cooldowns: 3
};

module.exports.run = async function ({ api, event, args }) {
 const { threadID, senderID } = event;

 if (!args[0]) {
 return api.sendMessage(
 "📦 Mirai Store\n\nUsage:\n" +
 "• !miraistore <id | name | category>\n" +
 "• !miraistore like <id>\n" +
 "• !miraistore trending\n" +
 "• !miraistore upload <commandName> (admin)\n" +
 "• !miraistore delete <id> <secret> (admin)",
 threadID
 );
 }

 const sub = args[0].toLowerCase();

 // ================= UPLOAD =================
 if (sub === "upload") {
 if (!ADMINS.includes(senderID))
 return api.sendMessage("❌ You are not allowed to upload.", threadID);

 const cmdName = args[1];
 if (!cmdName) return api.sendMessage("📁 Please provide a command name.", threadID);

 const commandsPath = path.join(__dirname, "..", "commands");
 const filePath1 = path.join(commandsPath, cmdName);
 const filePath2 = path.join(commandsPath, cmdName + ".js");

 let fileToRead;
 if (fs.existsSync(filePath1)) fileToRead = filePath1;
 else if (fs.existsSync(filePath2)) fileToRead = filePath2;
 else return api.sendMessage("❌ File not found in `commands` folder.", threadID);

 try {
 const data = fs.readFileSync(fileToRead, "utf8");

 // Syntax check
 try { new Function(data); } catch (e) {
 return api.sendMessage(`❌ Syntax Error:\n${e.message}`, threadID);
 }

 // Notify uploading
 const infoMsg = await new Promise((resolve, reject) => {
 api.sendMessage("📤 Uploading, please wait...", threadID, (err, info) => {
 if (err) reject(err);
 else resolve(info);
 });
 });

 const pastebinAPI = "https://pastebin-api.vercel.app";
 const pasteRes = await axios.post(`${pastebinAPI}/paste`, { text: data });
 setTimeout(() => api.unsendMessage(infoMsg.messageID), 1000);

 if (!pasteRes.data?.id) 
 return api.sendMessage("⚠️ Upload failed. No valid ID received from PasteBin server.", threadID);

 const rawUrl = `${pastebinAPI}/raw/${pasteRes.data.id}`;

 // Register upload in Miraistore
 const res = await axios.post(`${API_BASE}/miraistore/upload`, { rawUrl });
 if (res.data?.error)
 return api.sendMessage(`⚠️ Paste uploaded but Miraistore API error: ${res.data.error}`, threadID);

 // Extract metadata
 const name = data.match(/name\s*:\s*["'`](.*?)["'`]/)?.[1] || cmdName;
 const author = data.match(/credits\s*:\s*["'`](.*?)["'`]/)?.[1] || "Unknown";
 const version = data.match(/version\s*:\s*["'`](.*?)["'`]/)?.[1] || "N/A";
 const category = data.match(/commandCategory\s*:\s*["'`](.*?)["'`]/)?.[1] || "Unknown";
 const description = data.match(/description\s*:\s*["'`](.*?)["'`]/)?.[1] || "No description";
 const id = res.data.id;
 const uploadDate = new Date().toDateString();
 const views = 0;
 const likes = 0;

 const frameMsg =
`✅ Upload Successful!
╭─‣ Name : ${name}
├‣ Author : ${author}
├‣ Version : ${version}
├‣ Category : ${category}
├‣ Views : ${views}
├‣ Likes : ❤️ ${likes}
├‣ ID : ${id}
╰────────────◊
⭔ Description: ${description}
⭔ Upload : ${uploadDate}
🌐 URL : ${rawUrl}`;

 return api.sendMessage(frameMsg, threadID);

 } catch (err) {
 console.error(err);
 return api.sendMessage("❌ Upload failed. Try again later.", threadID);
 }
 }

 // ================= DELETE =================
 if (sub === "delete") {
 if (!ADMINS.includes(senderID))
 return api.sendMessage("❌ You are not allowed to delete.", threadID);

 const id = args[1];
 const secret = args[2];
 if (!id || !secret)
 return api.sendMessage("❌ Usage: !miraistore delete <id> <secret>", threadID);

 try {
 const res = await axios.post(`${API_BASE}/miraistore/delete/${id}`, { secret });
 if (res.data?.error)
 return api.sendMessage(`❌ ${res.data.error}`, threadID);

 return api.sendMessage(`🗑️ Deleted!\n🆔 ID: ${id}`, threadID);
 } catch {
 return api.sendMessage("❌ Delete API error.", threadID);
 }
 }

 // ================= LIKE =================
 if (sub === "like") {
 const id = args[1];
 if (!id) return api.sendMessage("❌ Usage: !miraistore like <id>", threadID);

 try {
 const res = await axios.post(`${API_BASE}/miraistore/like/${id}`, { userID: senderID });
 if (res.data?.message) return api.sendMessage("⚠️ Already liked.", threadID);

 return api.sendMessage(`❤️ Liked!\nTotal Likes: ${res.data.likes}`, threadID);
 } catch {
 return api.sendMessage("❌ Like API error.", threadID);
 }
 }

 // ================= TRENDING =================
 if (sub === "trend" || sub === "trending") {
 try {
 const res = await axios.get(`${API_BASE}/miraistore/trending?limit=3`);
 const data = res.data;

 if (!Array.isArray(data) || !data.length)
 return api.sendMessage("❌ No trending commands.", threadID);

 let msg = "🔥 Top 3 Trending Mirai Commands 🔥\n\n";
 data.slice(0, 3).forEach((cmd, i) => {
 const badge = i === 0 ? " 🏆 #1 TRENDING" : "";
 msg += `╭─‣ ${cmd.name}${badge}
├‣ Category : ${cmd.category}
├‣ Views : ${cmd.views}
├‣ Likes : ❤️ ${cmd.likes}
├‣ ID : ${cmd.id}
╰────────────◊

`;
 });

 return api.sendMessage(msg.trim(), threadID);
 } catch {
 return api.sendMessage("❌ Trending API error.", threadID);
 }
 }

 // ================= SEARCH =================
 const query = args.join(" ");
 try {
 const res = await axios.get(`${API_BASE}/miraistore/search?q=${encodeURIComponent(query)}`);
 const data = res.data;

 if (!data || data.message) return api.sendMessage("❌ Command not found.", threadID);

 // MULTIPLE RESULTS → keyword search
 if (Array.isArray(data)) {
 let msg = `📂 Search Results (${data.length})\n\n`;
 data.forEach(cmd => {
 msg += `╭─‣ ${cmd.name}
├‣ Category : ${cmd.category}
├‣ ID : ${cmd.id}
├‣ Upload : ${new Date(cmd.uploadDate).toDateString()}
╰────────────◊

`;
 });
 return api.sendMessage(msg.trim(), threadID);
 }

 // SINGLE RESULT → ID search
 const message = `╭─‣ Name : ${data.name}
├‣ Author : ${data.author}
├‣ Version : ${data.version || "N/A"}
├‣ Category : ${data.category}
├‣ Views : ${data.views}
├‣ Likes : ❤️ ${data.likes}
├‣ ID : ${data.id}
╰────────────◊
⭔ Description: ${data.description || "No description"}
⭔ Upload : ${new Date(data.uploadDate).toDateString()}
🌐 URL : ${data.rawUrl}`;

 return api.sendMessage(message, threadID);
 } catch {
 return api.sendMessage("❌ Search API error.", threadID);
 }
};
