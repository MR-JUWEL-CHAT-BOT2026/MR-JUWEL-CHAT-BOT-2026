const axios = require("axios");
const fs = require("fs");
const request = require("request");

const link = [
 "https://i.imgur.com/0l5UhmS.mp4",
"https://i.imgur.com/O3rar4t.mp4",
"https://i.imgur.com/ef28GQa.mp4",
"https://i.imgur.com/IhbvVXY.mp4",
"https://i.imgur.com/sttfCpY.mp4",
"https://i.imgur.com/Fz6MY3p.mp4",
"https://i.imgur.com/hqcPTYa.mp4",
"https://i.imgur.com/Q6NCh9l.mp4",
"https://i.imgur.com/LL699S0.mp4",
"https://i.imgur.com/VnP3rNL.mp4",
"https://i.imgur.com/gtUOcys.mp4",
"https://i.imgur.com/QQXBDqX.mp4",
"https://i.imgur.com/FUaM2vb.mp4",
"https://i.imgur.com/DE6DOAu.mp4",
"https://i.imgur.com/hPC7lCB.mp4",
"https://i.imgur.com/W3iA7JK.mp4",
"https://i.imgur.com/YNQjOUz.mp4",
"https://i.imgur.com/ZkRsBm9.mp4",
"https://i.imgur.com/VPnGC51.mp4",
"https://i.imgur.com/XA1hjYn.mp4",
"https://i.imgur.com/R7CWS6I.mp4",
"https://i.imgur.com/tFEJvku.mp4",
"https://i.imgur.com/qA6N92o.mp4",
"https://i.imgur.com/yxFA0j8.mp4",
"https://i.imgur.com/O8eVk6V.mp4",
"https://i.imgur.com/R0sXUMC.mp4",
"https://i.imgur.com/AY0egd1.mp4",
"https://i.imgur.com/maqUqQr.mp4",
"https://i.imgur.com/dZUaLxs.mp4",
"https://i.imgur.com/NsGQ6DN.mp4",
"https://i.imgur.com/OBbOS03.mp4",
];

module.exports.config = {
 name: "🔞",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "MR JUWEL",
 description: "auto reply to 🔞 (Only Admin)",
 commandCategory: "noprefix",
 usages: "🔞",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

const adminIDs = ["61591542717221"];

function isAdmin(userID) {
 return adminIDs.includes(userID.toString());
}

// সুপার কুল লোডিং এনিমেশন ফাংশন
function getLoadingAnimation(step) {
 const frames = [
   // Frame 1 - ডট এনিমেশন
   "🟢 ⚪ ⚪ ⚪ ⚪\n⏳ লোড হচ্ছে...",
   "⚪ 🟢 ⚪ ⚪ ⚪\n⏳ লোড হচ্ছে...",
   "⚪ ⚪ 🟢 ⚪ ⚪\n⏳ লোড হচ্ছে...",
   "⚪ ⚪ ⚪ 🟢 ⚪\n⏳ লোড হচ্ছে...",
   "⚪ ⚪ ⚪ ⚪ 🟢\n⏳ লোড হচ্ছে...",
   
   // Frame 2 - বার এনিমেশন
   "█░░░░░░░░░░░ 10%\n⏳ ভিডিও ডাউনলোড...",
   "██░░░░░░░░░░ 20%\n⏳ ভিডিও ডাউনলোড...",
   "███░░░░░░░░░ 30%\n⏳ ভিডিও ডাউনলোড...",
   "████░░░░░░░░ 40%\n⏳ ভিডিও ডাউনলোড...",
   "█████░░░░░░░ 50%\n⏳ ভিডিও ডাউনলোড...",
   "██████░░░░░░ 60%\n⏳ ভিডিও ডাউনলোড...",
   "███████░░░░░ 70%\n⏳ ভিডিও ডাউনলোড...",
   "████████░░░░ 80%\n⏳ ভিডিও ডাউনলোড...",
   "█████████░░░ 90%\n⏳ ভিডিও ডাউনলোড...",
   "██████████░░ 95%\n⏳ প্রস্তুত হচ্ছে...",
   "███████████░ 99%\n⏳ একদম শেষ...",
   
   // Frame 3 - স্পিনার এনিমেশন
   "◐ প্রক্রিয়াকরণ...\n⏳ ভিডিও লোড হচ্ছে",
   "◓ প্রক্রিয়াকরণ...\n⏳ ভিডিও লোড হচ্ছে",
   "◑ প্রক্রিয়াকরণ...\n⏳ ভিডিও লোড হচ্ছে",
   "◒ প্রক্রিয়াকরণ...\n⏳ ভিডিও লোড হচ্ছে",
   
   // Frame 4 - হৃদয় এনিমেশন
   "❤️ 🤍 🤍 🤍\n💓 ভিডিও আসছে...",
   "🤍 ❤️ 🤍 🤍\n💓 ভিডিও আসছে...",
   "🤍 🤍 ❤️ 🤍\n💓 ভিডিও আসছে...",
   "🤍 🤍 🤍 ❤️\n💓 ভিডিও আসছে...",
   
   // Frame 5 - রংবেরং এনিমেশন
   "🔴 ⚪ ⚪ ⚪\n🌈 প্রস্তুত হচ্ছে...",
   "⚪ 🟠 ⚪ ⚪\n🌈 প্রস্তুত হচ্ছে...",
   "⚪ ⚪ 🟡 ⚪\n🌈 প্রস্তুত হচ্ছে...",
   "⚪ ⚪ ⚪ 🟢\n🌈 প্রস্তুত হচ্ছে...",
   "🟣 ⚪ ⚪ ⚪\n🌈 প্রস্তুত হচ্ছে...",
   "⚪ 🔵 ⚪ ⚪\n🌈 প্রস্তুত হচ্ছে...",
 ];

 return frames[step % frames.length];
}

// ভিডিও ডাউনলোড ফাংশন
function downloadVideo(url, path) {
 return new Promise((resolve, reject) => {
   const file = fs.createWriteStream(path);
   const requestStream = request({
     url: encodeURI(url),
     timeout: 15000,
     headers: {
       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
       'Accept': 'video/mp4'
     }
   });
   
   requestStream.pipe(file);
   
   let progress = 0;
   requestStream.on('response', (response) => {
     const totalSize = parseInt(response.headers['content-length'], 10);
     let downloadedSize = 0;
     
     response.on('data', (chunk) => {
       downloadedSize += chunk.length;
       if (totalSize) {
         progress = (downloadedSize / totalSize) * 100;
       }
     });
   });
   
   file.on('finish', () => {
     file.close();
     resolve(true);
   });
   
   file.on('error', (err) => {
     fs.unlink(path, () => {});
     reject(err);
   });
   
   requestStream.on('error', (err) => {
     fs.unlink(path, () => {});
     reject(err);
   });
 });
}

// লোডিং মেসেজ আপডেট ফাংশন
async function updateLoadingMessage(api, messageID, threadID, step) {
 try {
   const loadingText = getLoadingAnimation(step);
   await api.editMessage(loadingText, messageID, threadID);
 } catch (error) {
   // ইগনোর এডিট এরর
 }
}

module.exports.handleEvent = async ({ api, event }) => {
 const content = event.body ? event.body : '';
 const body = content.toLowerCase();
 
 if (body.startsWith("🔞") || body === "🔞") {
   if (!isAdmin(event.senderID)) {
     return api.sendMessage("❌ এই কমান্ডটি শুধুমাত্র বট অ্যাডমিন ব্যবহার করতে পারবেন!", event.threadID, event.messageID);
   }
   
   let loadingMsg = null;
   
   try {
     // লোডিং মেসেজ পাঠান
     loadingMsg = await api.sendMessage(
       getLoadingAnimation(0),
       event.threadID
     );
     
     // এনিমেশন আপডেট করা
     let step = 1;
     const animationInterval = setInterval(async () => {
       if (step < 25) { // 25 বার আপডেট হবে
         await updateLoadingMessage(api, loadingMsg.messageID, event.threadID, step);
         step++;
       } else {
         clearInterval(animationInterval);
       }
     }, 300); // প্রতি 300ms পরে আপডেট
     
     const rahad = [
       "╭•┄┅══❁✡🔞❁══┅┄•╮\n\n 𝗠𝗥 𝗝𝗨𝗪𝗘𝗟 \n\n╰•┄┅══❁🔞❁══┅┄•╯",
       "╭•┄┅══❁✡🔞❁══┅┄•╮\n\n আমার বস জুয়েল এর পক্ষ থেকে 🥵🔞 \n\n╰•┄┅══❁🔞❁══┅┄•╯"
     ];
     const rahad2 = rahad[Math.floor(Math.random() * rahad.length)];
     
     const randomLink = link[Math.floor(Math.random() * link.length)];
     const videoPath = __dirname + "/cache/2024.mp4";
     
     // ভিডিও ডাউনলোড
     await downloadVideo(randomLink, videoPath);
     
     // এনিমেশন বন্ধ করুন
     clearInterval(animationInterval);
     
     // ফাইনাল লোডিং মেসেজ
     await api.editMessage(
       "✅ লোড সম্পূর্ণ! ভিডিও আসছে... 🎬",
       loadingMsg.messageID,
       event.threadID
     );
     
     // ভিডিও পাঠান
     await api.sendMessage({
       body: rahad2,
       attachment: fs.createReadStream(videoPath)
     }, event.threadID, () => {
       setTimeout(() => {
         fs.unlink(videoPath, (err) => {
           if (err) console.error('Error deleting file:', err);
         });
       }, 2000);
     });
     
     // লোডিং মেসেজ ডিলিট করুন
     setTimeout(() => {
       api.unsendMessage(loadingMsg.messageID);
     }, 1000);
     
   } catch (error) {
     console.error('Error:', error);
     
     // এনিমেশন বন্ধ করুন
     if (loadingMsg) {
       try {
         await api.editMessage(
           "❌ ভিডিও লোড করতে সমস্যা হয়েছে! তবে টেক্সট মেসেজ পাঠাচ্ছি...",
           loadingMsg.messageID,
           event.threadID
         );
       } catch (e) {}
       
       // লোডিং মেসেজ ডিলিট
       setTimeout(() => {
         api.unsendMessage(loadingMsg.messageID);
       }, 2000);
     }
     
     // শুধু টেক্সট পাঠান
     const rahad = [
       "╭•┄┅══❁✡🔞❁══┅┄•╮\n\n 𝗠𝗥 𝗝𝗨𝗪𝗘𝗟 \n\n╰•┄┅══❁🔞❁══┅┄•╯",
       "╭•┄┅══❁✡🔞❁══┅┄•╮\n\n আমার বস জুয়েল এর পক্ষ থেকে 🥵🔞 \n\n╰•┄┅══❁🔞❁══┅┄•╯"
     ];
     api.sendMessage(rahad[Math.floor(Math.random() * rahad.length)], event.threadID);
   }
 }
};
