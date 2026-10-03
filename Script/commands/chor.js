const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "chor", //⚠️ 𝗗𝗼𝗻'𝘁 𝗖𝗵𝗮𝗻𝗴𝗲 𝗡𝗮𝗺𝗲 — 𝗖𝗺𝗱 𝗪𝗶𝗹𝗹 𝗡𝗼𝘁 𝗪𝗼𝗿𝗸✅
  version: "2.0",
  hasPermssion: 0,
  credits: "🔰𝐑𝐀𝐇𝐀𝐓 𝐈𝐒𝐋𝐀𝐌🔰", //⚠️ 𝗗𝗼𝗻'𝘁 𝗖𝗵𝗮𝗻𝗴𝗲 𝗖𝗿𝗲𝗱𝗶𝘁 — 𝗖𝗺𝗱 𝗪𝗼𝗻'𝘁 𝗪𝗼𝗿𝗸✅
  description: "image generate",
  commandCategory: "Image",
  usages: "[@mention/reply/uid/link]",
  cooldowns: 5
};

const API_JSON_URL = "https://raw.githubusercontent.com/Rahat-Islam10/-Rahat-Boss-/refs/heads/main/api.json";
async function getUIDByFullName(api, threadID, body) {
  if (!body.includes("@")) return null;
  const match = body.match(/@(.+)/);
  if (!match) return null;
const targetName = match[1].trim().toLowerCase().replace(/\s+/g, " ");
  const threadInfo = await api.getThreadInfo(threadID);
  const users = threadInfo.userInfo || [];
const user = users.find(u => {
    if (!u.name) return false;
    const fullName = u.name.trim().toLowerCase().replace(/\s+/g, " ");
    return fullName === targetName;
  });
return user ? user.id : null;
}
async function getApiList(commandName) {
  const res = await axios.get(API_JSON_URL, { timeout: 15000 });
  const data = res.data || {};
  const cmdData = data[commandName];
 if (!cmdData || !cmdData.api) {
    throw new Error(`❌"${commandName}" API পাওয়া যায়নি`);
  }
const apiList = [cmdData.api, ...(cmdData.backupApis || [])].filter(Boolean);
  if (!apiList.length) {
    throw new Error(`❌"${commandName}" Api পাওয়া যায়নি`);
  }
return apiList;
}
async function generateFrameWithFallback({ senderID, mention, credit, apiList }) {
  let lastError = null;
 for (const baseApi of apiList) {
    const cleanBase = baseApi.replace(/\/+$/, "");
    const apiUrl = `${cleanBase}/api/frame?type=chor&senderId=${senderID}&mentionId=${mention}&credit=${encodeURIComponent(credit)}`;
  try {
      const response = await axios.get(apiUrl, {
        timeout: 30000,
        responseType: 'json'
      });
  const data = response.data;
      if (data.image && data.captionTemplate) {
        const imageBuffer = Buffer.from(data.image, 'base64');
        return { imageBuffer, captionTemplate: data.captionTemplate };
      } else {
        throw new Error("❌API Error");
      }
    } catch (error) {
      lastError = error;
      if (error.response?.status === 401 && error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
    }
  }
 throw lastError || new Error("❌API কাজ করছে না");
}
module.exports.run = async function ({ api, event, args }) {
  try {
    let mention, mentionName;
  if (event.type === "message_reply") {
      mention = event.messageReply.senderID;
    } else if (args[0]) {
      if (args[0].includes(".com/")) {
        mention = await api.getUID(args[0]);
      } else if (args.join().includes("@")) {
        mention = Object.keys(event.mentions || {})[0];
        if (!mention) mention = await getUIDByFullName(api, event.threadID, args.join(" "));
      } else {
        mention = args[0];
      }
    } else {
      return api.sendMessage("❌ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗺𝗲𝗻𝘁𝗶𝗼𝗻 𝗮 𝘂𝘀𝗲𝗿", event.threadID, event.messageID);
    }
  if (!mention) {
      return api.sendMessage("❌ 𝗨𝘀𝗲𝗿 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱 🐸\n𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝗵𝗲𝗿 𝗽𝗿𝗼𝗳𝗶𝗹𝗲", event.threadID, event.messageID);
    }
   const userInfo = await api.getUserInfo(mention);
    mentionName = userInfo[mention]?.name || "Unknown";
    const senderID = event.senderID;
    const credit = module.exports.config.credits;
  const waiting = await api.sendMessage("⏳𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁....", event.threadID);
 const apiConfigList = await getApiList(module.exports.config.name);
    const { imageBuffer, captionTemplate } = await generateFrameWithFallback({
      senderID,
      mention,
      credit,
      apiList: apiConfigList
    });
    const finalCaption = captionTemplate.replace(/{{name}}/g, mentionName);
    const outPath = path.join(__dirname, `chor_${Date.now()}.png`);
    fs.writeFileSync(outPath, imageBuffer);
    await api.unsendMessage(waiting.messageID);
    const messageInfo = await api.sendMessage(
      {
        body: finalCaption,
        mentions: [{ tag: mentionName, id: mention }],
        attachment: fs.createReadStream(outPath)
      },
      event.threadID,
      event.messageID
    );
  setTimeout(async () => {
      try {
        await api.unsendMessage(messageInfo.messageID);
        fs.unlinkSync(outPath);
      } catch (e) {}
    }, 120000);

  } catch (error) {
    return api.sendMessage(`⚠️ ${error.message}`, event.threadID);
  }
};
