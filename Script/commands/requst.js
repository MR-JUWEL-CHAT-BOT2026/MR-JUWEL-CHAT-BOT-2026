module.exports.config = {
  name: "request",
  version: "1.1.0",
  credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
  hasPermssion: 2,
  description: "Manage bot's pending group requests",
  commandCategory: "system",
  cooldowns: 5,
  hasEvent: true
};

module.exports.languages = {
  "en": {
    "invaildNumber": "❌ %1 is not a valid number",
    "noPermission": `┏━━━━━━━━━━━━━━━┓
┃ ❌ ONLY ADMIN   ┃
┗━━━━━━━━━━━━━━━┛`,
    "cancelSuccess": `┏━━━━━━━━━━━━━━━┓
┃ ❌ REJECT DONE  ┃
┣━━━━━━━━━━━━━━━┫
┃ %1 group rejected
┗━━━━━━━━━━━━━━━┛`,
    "approveSuccess": `┏━━━━━━━━━━━━━━━┓
┃ ✅ APPROVED     ┃
┣━━━━━━━━━━━━━━━┫
┃ %1 group approved
┗━━━━━━━━━━━━━━━┛`,
    "cantGetPendingList": "❌ Failed to retrieve pending list!",
    "returnListClean": `┏━━━━━━━━━━━━━━━┓
┃ ✅ NO PENDING   ┃
┗━━━━━━━━━━━━━━━┛`,
    "returnListPending": `┏━━━━━━━━━━━━━━━┓
┃ 📜 PENDING LIST
┣━━━━━━━━━━━━━━━┫
┃ Total: %1 group(s)
┣━━━━━━━━━━━━━━━┫
%2
┣━━━━━━━━━━━━━━━┫
┃ ✔ 1 2 3 = approve
┃ ❌ c1 c2 = reject
┗━━━━━━━━━━━━━━━┛`,
    "pendingRequest": `✅ আপনার রিকোয়েস্ট পেন্ডিং আছে। অ্যাপ্রুভের জন্য অপেক্ষা করুন।`,
    "notApproved": `⏳ এই গ্রুপ এখনও অ্যাপ্রুভ হয়নি। দয়া করে অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।`,
    "approved": `✅ এই গ্রুপ অ্যাপ্রুভ হয়েছে! এখন বট সক্রিয়।`
  }
};

// পেন্ডিং গ্রুপ সংরক্ষণের জন্য গ্লোবাল ভেরিয়েবল
if (!global.pendingGroups) global.pendingGroups = [];
if (!global.approvedGroups) global.approvedGroups = [];

function isAdmin(senderID) {
  return global.config.ADMINBOT.includes(senderID);
}

// ✅ হ্যান্ডেল ইভেন্ট - বট লিভ না করে পেন্ডিং মোডে থাকে
module.exports.handleEvent = async function({ api, event, getText }) {
  const { logMessageType, logMessageData, threadID, author, body, senderID } = event;

  try {
    // যখন বটকে গ্রুপে অ্যাড করা হবে
    if (logMessageType === "log:subscribe" && logMessageData?.addedParticipants) {
      const botID = api.getCurrentUserID();
      const isBotAdded = logMessageData.addedParticipants.some(p => p.userFbId == botID);

      if (isBotAdded) {
        const addedBy = author;
        
        // গ্রুপ ইনফো নেওয়া
        const threadInfo = await api.getThreadInfo(threadID);
        const groupName = threadInfo.name || "Unnamed Group";
        const members = threadInfo.participantIDs?.length || 0;
        
        // চেক করা যে গ্রুপটি ইতিমধ্যে পেন্ডিং লিস্টে আছে কিনা
        const alreadyPending = global.pendingGroups.some(g => g.threadID === threadID);
        const alreadyApproved = global.approvedGroups.some(g => g.threadID === threadID);
        
        if (!alreadyPending && !alreadyApproved) {
          // পেন্ডিং লিস্টে যোগ করা
          global.pendingGroups.push({
            threadID: threadID,
            groupName: groupName,
            members: members,
            addedBy: addedBy,
            timestamp: Date.now()
          });
        }

        // ❌ বট লিভ করবে না - গ্রুপে থাকবে কিন্তু নিষ্ক্রিয় থাকবে

        // অ্যাডকারীকে মেসেজ দেওয়া
        try {
          await api.sendMessage(getText("pendingRequest"), addedBy);
        } catch (e) {}

        // গ্রুপে মেসেজ দেওয়া
        try {
          await api.sendMessage(`⏳ বট পেন্ডিং মোডে আছে। অ্যাপ্রুভের জন্য অপেক্ষা করুন।`, threadID);
        } catch (e) {}
      }
    }

    // 📌 বট পেন্ডিং থাকাকালীন কোনো কমান্ড কাজ করবে না
    if (global.pendingGroups.some(g => g.threadID === threadID)) {
      // চেক করা যে বট এই গ্রুপে পেন্ডিং আছে কিনা
      const isPending = global.pendingGroups.some(g => g.threadID === threadID);
      
      if (isPending) {
        // বটের নিজের মেসেজ ইগনোর করা
        if (senderID === api.getCurrentUserID()) return;
        
        // পেন্ডিং গ্রুপে কোনো কমান্ড চলবে না
        return;
      }
    }

    // ✅ অ্যাপ্রুভ হওয়ার পর বট সক্রিয় হবে
    if (global.approvedGroups.some(g => g.threadID === threadID)) {
      // বট সক্রিয় - এখানে স্বাভাবিক কাজ করবে
      // (এই অংশটি খালি রাখা হয়েছে, কারণ বটের অন্যান্য কমান্ড এখানে কাজ করবে)
    }

  } catch (error) {
    console.error("Event error:", error);
  }
};

// ✅ হ্যান্ডেল রিপ্লাই
module.exports.handleReply = async function({ api, event, handleReply, getText }) {
  if (String(event.senderID) !== String(handleReply.author)) return;

  if (!isAdmin(event.senderID)) {
    return api.sendMessage(getText("noPermission"), event.threadID, event.messageID);
  }

  const { body, threadID, messageID } = event;
  let count = 0;

  // ❌ REJECT (CANCEL)
  if ((isNaN(body) && body.toLowerCase().startsWith("c")) || body.toLowerCase().startsWith("cancel")) {
    const indexes = body.match(/\d+/g) || [];

    for (const num of indexes) {
      const index = parseInt(num);
      if (isNaN(index) || index <= 0 || index > handleReply.pending.length) {
        return api.sendMessage(getText("invaildNumber", num), threadID, messageID);
      }

      const groupInfo = handleReply.pending[index - 1];
      const groupID = groupInfo.threadID;
      
      // পেন্ডিং লিস্ট থেকে রিমুভ করা
      global.pendingGroups = global.pendingGroups.filter(g => g.threadID !== groupID);
      
      // বটকে গ্রুপ থেকে রিমুভ করা (রিজেক্ট)
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), groupID);
      } catch (e) {}
      
      count++;
    }

    return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
  }

  // ✅ APPROVE
  else {
    const indexes = body.match(/\d+/g) || [];

    for (const num of indexes) {
      const index = parseInt(num);
      if (isNaN(index) || index <= 0 || index > handleReply.pending.length) {
        return api.sendMessage(getText("invaildNumber", num), threadID, messageID);
      }

      const groupInfo = handleReply.pending[index - 1];
      const groupID = groupInfo.threadID;
      
      // পেন্ডিং লিস্ট থেকে রিমুভ করা
      global.pendingGroups = global.pendingGroups.filter(g => g.threadID !== groupID);
      
      // অ্যাপ্রুভড লিস্টে যোগ করা
      global.approvedGroups.push({
        threadID: groupID,
        groupName: groupInfo.groupName,
        approvedBy: event.senderID,
        approvedTime: Date.now()
      });
      
      count++;

      try {
        // সামান্য delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 🔥 NOTI BOX 1
        await api.sendMessage(`চ্ঁলে্ঁ এ্ঁসে্ঁছি্ঁ ⎯꯭𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐ এঁখঁনঁ তোঁমাঁদেঁরঁ সাঁথেঁ আঁড্ডাঁ দিঁবঁ..!😘`, groupID);

        // 🔥 বটের নিকনেম সেট করা
        try {
          await api.changeNickname("⎯꯭𓆩꯭𝆺𝅥😻⃞𝐑⃞𝐈⃞𝐘⃞𝐀⃞༢࿐", groupID, api.getCurrentUserID());
        } catch (e) {}

        await new Promise(resolve => setTimeout(resolve, 800));

        // 🔥 NOTI BOX 2
        await api.sendMessage(`╭•┄┅═══❁🌺❁═══┅┄•╮
আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ
╰•┄┅═══❁🌺❁═══┅┄•╯

𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞 𝐭𝐨 𝐲𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩! 🖤🤗
𝐈 𝐰𝐢𝐥𝐥 𝐚𝐥𝐰𝐚𝐲𝐬 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮 𝐢𝐧𝐬𝐡𝐚𝐀𝐥𝐥𝐚𝐡 🌺❤️

𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭:
${global.config.PREFIX}help
${global.config.PREFIX}info
${global.config.PREFIX}admin

➤ Messenger: mrjuwel520
➤ WhatsApp: +8801943488192

❖⋆══════════════⋆❖
𝐎𝐰𝐧𝐞𝐫➢ 𝐌𝐑 𝐉𝐔𝐖𝐄𝐋`, groupID);
        
        // অ্যাপ্রুভ সফল মেসেজ
        await api.sendMessage(getText("approved"), groupID);
        
      } catch (e) {
        console.error("Approve error:", e);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
  }
};

// ✅ রান ফাংশন - পেন্ডিং লিস্ট দেখানো
module.exports.run = async function({ api, event, getText }) {
  const { threadID, messageID, senderID } = event;

  if (!isAdmin(senderID)) {
    return api.sendMessage(getText("noPermission"), threadID, messageID);
  }

  try {
    // গ্লোবাল পেন্ডিং লিস্ট থেকে ডাটা নেওয়া
    const pendingList = global.pendingGroups || [];
    
    if (pendingList.length === 0) {
      return api.sendMessage(getText("returnListClean"), threadID, messageID);
    }

    // অ্যাডকারীর নাম আপডেট করা
    for (let group of pendingList) {
      if (group.addedBy) {
        try {
          const userInfo = await api.getUserInfo(group.addedBy);
          group.addedByName = userInfo[group.addedBy]?.name || "Unknown";
        } catch (e) {}
      }
    }

    // পেন্ডিং লিস্ট তৈরি করা
    const msgArr = pendingList.map((group, index) => {
      const addedByName = group.addedByName || "Unknown";
      const profileLink = `https://www.facebook.com/${group.addedBy}`;
      
      return `┃ ${index + 1}. ${group.groupName || 'Unnamed'}
┃ 🆔 ${group.threadID}
┃ 👥 ${group.members || 0} members
┃ 👤 ${addedByName}
┃ 🔗 ${profileLink}`;
    });

    const msg = msgArr.join("\n┣━━━━━━━━━━━━━━━┫\n");

    return api.sendMessage(
      getText("returnListPending", pendingList.length, msg),
      threadID,
      (error, info) => {
        if (!error) {
          global.client.handleReply.push({
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            pending: pendingList
          });
        }
      },
      messageID
    );

  } catch (e) {
    console.error("Pending list error:", e);
    return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
  }
};
