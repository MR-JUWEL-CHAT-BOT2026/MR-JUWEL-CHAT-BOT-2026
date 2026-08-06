module.exports.config = {
 name: "welcome",
 version: "1.0.8",
 hasPermssion: 0,
 credits: "𝐌𝐑 𝐉𝐔𝐖𝐄𝐋",
 description: "Welcome system fixed only mention rule",
 commandCategory: "group",
 usages: "/welcome [reply/mention/uid]",
 cooldowns: 5
};

async function getName(Users, uid) {
 try {
 return await Users.getNameUser(uid);
 } catch {
 return "User";
 }
}

module.exports.run = async ({ api, event, args, Users }) => {
 const threadID = event.threadID;

 const threadInfo = await api.getThreadInfo(threadID).catch(() => null);
 const groupName = threadInfo?.threadName || "Unknown Group";

 // 🔴 FIXED TARGET DETECT (IMPORTANT)
 let targetID = null;

 if (event.messageReply) {
 targetID = event.messageReply.senderID;
 }
 else if (event.mentions && Object.keys(event.mentions).length > 0) {
 targetID = Object.keys(event.mentions)[0];
 }
 else if (args[0]) {
 targetID = args[0];
 }

 // ✅ STRICT RULE FIX
 if (!targetID) {
 return api.sendMessage(
 "😘বেবি কাউকে mention করো বা তার message এ reply দিয়ে /welcome ব্যবহার করো✅",
 threadID,
 event.messageID
 );
 }

 const username = await getName(Users, targetID);

 const adminIDs = threadInfo?.adminIDs?.map(i => i.id) || [];

 let adminText = "";
 let mentions = [];

 for (let id of adminIDs) {
 const name = await getName(Users, id);
 adminText += `@${name}\n`;
 mentions.push({ id, tag: name });
 }

 const botadmin = "61591542717221";
 const botadminName = await getName(Users, botadmin);

 // BOT ADMIN MENTION
 mentions.push({
 id: botadmin,
 tag: botadminName
 });

 // USER MENTION
 mentions.push({
 id: targetID,
 tag: username
 });

 const msg = `
𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚𐙚






❥‌‌𖠣꙰ٜٜٜٜٜٜٜٜٜ‌‌‌‌‌‌‌‌‌‌‌‌⚀ค้้้้้้้้้้้้้้้้้้้­้้้้้้้้้้้้้้้้้้้้­้้้้้้้้ـٰٖٖٖٖٖٜ۬ـٰٰٖٖٖٖٜ۬ـٰٰٰٖٖٖٜ۬ـٰٰٰٰٖٖٜ۬ـٰٰٰٰٰٖٜ۬𝐴𝑠𝑠𝑙𝑎𝑚𝑢𝑙𝑎𝑖𝑘𝑢𝑚ـٰٖٖٖٖٖٜ۬ـٰٰٖٖٖٖٜ۬ـٰٰٰٖٖٖٜ۬ـٰٰٰٰٖٖٜ۬ـٰٰٰٰٰٖٜ۬ค้้้้้้้้้้้้้้้้้้้­้้้้้้้้้้้้้้้้้้้้­้้้้้้้้⁜ٜٜٜٜٜٜٜٜٜ‌‌❥꙰
┏━━━━━━━━━━━━━━━┓

 ${groupName}

┗━━━━━━━━━━━━━━━┛
গু্ঁপে্ঁ আ্ঁমা্ঁদে্ঁর্ঁ সা্ঁথে্ঁ যু্ঁক্ত্ঁ হ্ঁও্ঁয়া্ঁর্ঁ

 জ্ঁন্য্ঁ তো্ঁমা্ঁকে্ঁ অ্ঁস্ঁংখ্য্ঁ ধ্ঁন্য্ঁবা্ঁদ্ঁ ┏━━━━━━━━━━━━━━━┓
༊তা্ঁর সা্ঁথে্ঁ ༆ এ্ঁর্ঁ প্ঁক্ষ্ঁ
থে্ঁকে্ঁ হা্ঁজা্ঁরো্ঁ কা্ঁঠ্ঁ 🌹🥀

গো্ঁলা্ঁপে্ঁর্ঁ শু্ঁভে্ঁচ্ছা্ঁ ও্ঁ

 অ্ঁভি্ঁন্ঁদ্ঁন্ঁ༊᭄আ্ঁমা্ঁদে্ঁর্ঁ সা্ঁথে্ঁই্ঁ 
সা্ঁথে্ঁ যু্ঁক্ত্ঁ হ্ঁয়ে্ঁছে্ঁন্ঁ & আ্ঁমা্ঁদে্ঁর্ঁ

 সা্ঁথে্ঁই্ঁ থা্ঁক্ঁবা্ঁ🫶🫰💝┗━━━━━━━━━━━━━━━┛

 ⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ ⍣⃟⍣⃟ 

┏━━━━━━━━━━━━━━━┓,, আ্ঁশা্ঁ,,ক্ঁরি্ঁ,,গ্রু্ঁপে্ঁ,স্ঁম্ঁয়্ঁ,,

দি্ঁবা্ঁ স্ঁবা্ঁর্ঁ,,, সা্ঁথে্ঁ,,আ্ঁড্ডা্ঁ,,

 দি্ঁবা্ঁ,, কো্ঁন্ঁ,,স্ঁম্ঁস্যা্ঁ,, হ্ঁলে্ঁ

🔰এ্ঁড্ঁমি্ঁন্ঁকে্ঁ🔰,, জা্ঁনা্ঁবা্ঁ,,

,༆নি্ঁজে্ঁর্ঁ,, ম্ঁনে্ঁ,, ক্ঁরে্ঁ,

গ্রু্ঁপ্ঁটা্ঁকে্ঁ 🫶ভা্ঁলো্ঁবা্ঁস্ঁবা্ঁ★ ┗━━━━━━━━━━━━━━━┛
┏━━━━━━━━━━━━━━━━━━┓
 👤 𝐁🅞𝐓 𝐀𝐃🅜𝐈𝐍

 👉 ${botadminName}
 🔗 https://www.facebook.com/profile.php?id=${botadmin}
━━━━━━━━━━━━━━━━━━━━
👥𝐆𝐎🅡𝐔𝐏 𝐀𝐃🅜𝐈𝐍 
 
 ${adminText}
┗━━━━━━━━━━━━━━━━━━━┛
╭──────•◈•──────╮
💓══❥ⵗⵗ̥̥̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̥̥ⵗ̥̥̥̥̥̥̥̥̥̥̊̊ⵗ̥̥̥̥̥̥̥̥̥̊̊̊ⵗ̥̥̥̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̥̥̊̊̊̊̊ⵗ̥̥̥̥̥̊̊̊̊ⵗ̥̥̥̥̊̊̊ⵗ̥̥̊̊══❥💓 ┏━━━━━━━━━━━━━━━┓
 
 ──⃟🐱𝗪𝗘𝗟𝗖𝗢𝗠𝗘🫵🫶🫂🌷

 ━〲😽ꤪ ${username}

┗━━━━━━━━━━━━━━━┛
`;

 return api.sendMessage({
 body: msg,
 mentions: mentions
 }, threadID, event.messageID);
};
