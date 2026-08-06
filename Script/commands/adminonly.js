module.exports.config = {
 name: "onlyadmin",
 version: "1.0",
 hasPermssion: 2,
 credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "Admin only",
 commandCategory: "Admin",
 usages: "qtvonly",
 cooldowns: 5,
 dependencies: {
 "fs-extra": ""
 }
};

module.exports.onLoad = function() {
 const { writeFileSync, existsSync } = require('fs-extra');
 const { resolve } = require("path");
 const path = resolve(__dirname, 'cache', 'data.json');
 if (!existsSync(path)) {
 const obj = {
 adminbox: {}
 };
 writeFileSync(path, JSON.stringify(obj, null, 4));
 } else {
 const data = require(path);
 if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
 writeFileSync(path, JSON.stringify(data, null, 4));
 }
}
module.exports.run = async function ({ api, event, args }) {
const { threadID, messageID, mentions } = event;

 const { resolve } = require("path");
 const pathData = resolve(__dirname, 'cache', 'data.json');
 const database = require(pathData);
 const { adminbox } = database; 
 if (adminbox[threadID] == true) {
 adminbox[threadID] = false;
 api.sendMessage("» Successfully disabled admin and only mode (everyone can use bots)", threadID, messageID);
 } else {
 adminbox[threadID] = true;
 api.sendMessage("» Successfully enabled admin only mode (only admin with admin of group can use bot)", threadID, messageID);
 }
}