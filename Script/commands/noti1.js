const fs = require('fs');
const request = require("request");

module.exports.config = {
  'name': "noti1",
  'version': "1.0.0",
  'hasPermssion': 0x2,
  'credits': "MAHBUB SHAON",
  'description': 'গ্রুপ তালিকা দেখায় এবং নির্বাচিত গ্রুপে নোটিশ পাঠায়',
  'commandCategory': "admin",
  'usages': "[noti1] অথবা [noti1 reply]",
  'cooldowns': 0x5
};

let atmDir = [];

const getAtm = (attachments, body) => new Promise(async resolve => {
  let msg = { body: body };
  let attachment = [];
  
  for (let att of attachments) {
    await new Promise(async resolve2 => {
      try {
        let response = await request.get(att.url);
        let pathname = response.uri.pathname;
        let ext = pathname.substring(pathname.lastIndexOf('.') + 1);
        let filePath = __dirname + "/cache/" + att.filename + '.' + ext;
        
        response.pipe(fs.createWriteStream(filePath)).on("close", () => {
          attachment.push(fs.createReadStream(filePath));
          atmDir.push(filePath);
          resolve2();
        });
      } catch (e) {
        console.log(e);
        resolve2();
      }
    });
  }
  
  msg.attachment = attachment;
  resolve(msg);
});

module.exports.handleReply = async function({ api, event, handleReply, Users, Threads }) {
  const { threadID, messageID, senderID, body } = event;
  const userName = await Users.getNameUser(senderID);
  
  switch (handleReply.type) {
    case "showGroups": {
      let selectedGroup = handleReply.groups[parseInt(body) - 1];
      
      if (!selectedGroup) {
        return api.sendMessage("❌ ভুল সংখ্যা! দয়া করে সঠিক নাম্বার সিলেক্ট করুন।", threadID, messageID);
      }
      
      api.sendMessage(
        `📢 আপনি "${selectedGroup.threadName}" গ্রুপে নোটিশ পাঠাতে চান।\n\n` +
        `দয়া করে আপনার নোটিশ মেসেজ টাইপ করুন (রিপ্লাই ছাড়া):`, 
        threadID, (err, info) => {
          global.client.handleReply.push({
            'name': this.config.name,
            'type': "sendNoti",
            'messageID': info.messageID,
            'threadID': threadID,
            'targetGroup': selectedGroup.threadID,
            'targetName': selectedGroup.threadName
          });
        }
      );
      break;
    }
    
    case "sendNoti": {
      let notiMsg = `📢 𝐀𝐃𝐌𝐈𝐍 𝐍𝐎𝐓𝐈𝐅𝐈𝐂𝐀𝐓𝐈𝐎𝐍\n•┄┅═════❁🌺❁═════┅┄•\n\n`;
      notiMsg += `𝐌𝐄𝐒𝐒𝐀𝐆𝐄: ${body}\n\n`;
      notiMsg += `𝐅𝐑𝐎𝐌: ${userName}\n`;
      notiMsg += `𝐓𝐎: ${handleReply.targetName}`;
      
      let msgToSend = notiMsg;
      
      if (event.attachments.length > 0) {
        msgToSend = await getAtm(event.attachments, notiMsg);
      }
      
      // টার্গেট গ্রুপে নোটিশ পাঠান
      api.sendMessage(msgToSend, handleReply.targetGroup, (err, info) => {
        atmDir.forEach(file => fs.unlinkSync(file));
        atmDir = [];
        
        if (err) {
          api.sendMessage("❌ নোটিশ পাঠাতে ব্যর্থ! গ্রুপটি কি এখনও বিদ্যমান?", threadID);
        } else {
          api.sendMessage(`✅ নোটিশ সফলভাবে "${handleReply.targetName}" গ্রুপে পাঠানো হয়েছে!`, threadID);
        }
      });
      
      // 👇 এখানে যোগ করা হলো - ইউজারের রিপ্লাই admin এর কাছে পাঠানো
      // ইউজারের রিপ্লাই admin কে জানানোর জন্য
      const adminID = "61591542717221"; // আপনার ফেসবুক আইডি দিন
      const adminReplyMsg = `📩 𝐍𝐄𝐖 𝐑𝐄𝐏𝐋𝐘\n•┄┅═════❁🌺❁═════┅┄•\n\n`;
      const replyContent = `𝐔𝐒𝐄𝐑: ${userName}\n`;
      const replyContent2 = `𝐆𝐑𝐎𝐔𝐏: ${handleReply.targetName}\n`;
      const replyContent3 = `𝐑𝐄𝐏𝐋𝐘: ${body}\n\n`;
      const replyContent4 = `💡 রিপ্লাই দিতে চাইলে এই মেসেজে রিপ্লাই করুন।`;
      
      let adminMsg = adminReplyMsg + replyContent + replyContent2 + replyContent3 + replyContent4;
      
      if (event.attachments.length > 0) {
        adminMsg = await getAtm(event.attachments, adminReplyMsg + replyContent + replyContent2 + replyContent3 + replyContent4);
      }
      
      // admin কে ইউজারের রিপ্লাই পাঠানো
      api.sendMessage(adminMsg, adminID, (err, info) => {
        if (!err) {
          // admin থেকে রিপ্লাই আসলে সেটা ইউজারকে জানানো
          global.client.handleReply.push({
            'name': this.config.name,
            'type': "adminReply",
            'messageID': info.messageID,
            'threadID': threadID,
            'userID': senderID,
            'userName': userName,
            'targetGroup': handleReply.targetGroup,
            'targetName': handleReply.targetName
          });
        }
      });
      break;
    }
    
    case "adminReply": {
      // admin থেকে রিপ্লাই ইউজারের কাছে পাঠানো
      const adminName = await Users.getNameUser(senderID);
      let replyMsg = `📩 𝐀𝐃𝐌𝐈𝐍 𝐑𝐄𝐏𝐋𝐘\n•┄┅═════❁🌺❁═════┅┄•\n\n`;
      replyMsg += `𝐌𝐄𝐒𝐒𝐀𝐆𝐄: ${body}\n\n`;
      replyMsg += `𝐀𝐃𝐌𝐈𝐍: ${adminName}\n`;
      replyMsg += `𝐅𝐎𝐑: ${handleReply.userName}`;
      
      let msgToSend = replyMsg;
      
      if (event.attachments.length > 0) {
        msgToSend = await getAtm(event.attachments, replyMsg);
      }
      
      // ইউজারকে admin এর রিপ্লাই পাঠানো
      api.sendMessage(msgToSend, handleReply.userID, (err, info) => {
        atmDir.forEach(file => fs.unlinkSync(file));
        atmDir = [];
        
        if (!err) {
          api.sendMessage("✅ আপনার রিপ্লাই ইউজারের কাছে পাঠানো হয়েছে!", threadID);
        }
      });
      break;
    }
  }
};

module.exports.run = async function({ api, event, args, Users, Threads }) {
  const { threadID, messageID, senderID } = event;
  
  // সব গ্রুপের তালিকা পান
  const allThreads = global.data.allThreadID || [];
  let groupList = [];
  let groupCount = 0;
  
  // গ্রুপের নাম সহ তালিকা তৈরি করুন
  for (let id of allThreads) {
    try {
      const threadInfo = await Threads.getInfo(id);
      if (threadInfo && threadInfo.threadName) {
        groupCount++;
        groupList.push({
          threadID: id,
          threadName: threadInfo.threadName,
          memberCount: threadInfo.memberCount || 0
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  
  if (groupList.length === 0) {
    return api.sendMessage("❌ বট কোনো গ্রুপে নেই!", threadID, messageID);
  }
  
  // গ্রুপ তালিকা তৈরি করুন
  let msg = "📋 𝐀𝐋𝐋 𝐆𝐑𝐎𝐔𝐏𝐒 𝐋𝐈𝐒𝐓\n•┄┅═════❁🌺❁═════┅┄•\n\n";
  msg += `📌 মোট ${groupList.length} টি গ্রুপ পাওয়া গেছে\n\n`;
  
  groupList.forEach((group, index) => {
    msg += `${index + 1}. ${group.threadName}\n`;
    msg += `   👥 সদস্য: ${group.memberCount}\n\n`;
  });
  
  msg += "•┄┅═════❁🌺❁═════┅┄•\n";
  msg += "💡 নোটিশ পাঠানোর জন্য উপরের নাম্বার টাইপ করে রিপ্লাই দিন।";
  
  // তালিকা পাঠান এবং রিপ্লাই হ্যান্ডলার সেট করুন
  api.sendMessage(msg, threadID, (err, info) => {
    if (err) return console.log(err);
    
    global.client.handleReply.push({
      'name': this.config.name,
      'type': "showGroups",
      'messageID': info.messageID,
      'threadID': threadID,
      'groups': groupList
    });
  }, messageID);
};
