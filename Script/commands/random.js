module.exports.config = {
 'name': "random",
 'version': "11.9.7",
 'hasPermission': 0,
 'credits': "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
 'description': "random love story video",
 'commandCategory': "video",
 'usages': "random",
 'cooldowns': 5
};

module.exports.run = async function ({ api, event }) {
 const axios = require("axios");
 const request = require("request");
 const fs = require('fs');

 const path = __dirname + "/cache";
 if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

 const apiResponse = await axios.get("https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json");
 const apiUrl = apiResponse.data.api;

 var videoUrls = [apiUrl + "/video/random"];
 var randomUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

 axios.get(randomUrl).then(response => {
 let videoCount = response.data.count;
 let videoName = response.data.name;

 let filePath = path + "/Shaoon.mp4";

 let sendVideo = function () {

 // ✅ SAFE size calculation (no crash)
 let size = "Unknown";
 try {
 const stats = fs.statSync(filePath);
 size = (stats.size / (1024 * 1024)).toFixed(2) + " MB";
 } catch (e) {}

 // duration safe
 let duration = response.data.duration || "Unknown";

 api.sendMessage({
 body: `╭─❍ 𝗥𝗔𝗡𝗗𝗢𝗠 𝗩𝗜𝗗𝗘𝗢 ❍─╮
│ 🎬 Title : ${videoName}
│ 📦 Size : ${size}
│ ⏱️ Duration : ${duration}
│ 🎞 Total Video : ${videoCount}
│ 👑 Admin : 乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐
╰───────────────╯`,
 attachment: fs.createReadStream(filePath)
 },
 event.threadID,
 () => fs.unlinkSync(filePath),
 event.messageID
 );
 };

 request(response.data.url)
 .pipe(fs.createWriteStream(filePath))
 .on("close", sendVideo);
 }).catch(err => {
 api.sendMessage("❌ API error / ভিডিও লোড হয়নি", event.threadID);
 });
};
