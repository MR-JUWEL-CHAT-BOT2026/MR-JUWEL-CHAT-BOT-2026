const request = require("request");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "slap",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "mirai-team",
  description: "Slap the friend you mention",
  commandCategory: "game",
  usages: "@tag",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs": "",
    "axios": ""
  }
};

module.exports.run = async({api, event, args, client, Users, Threads, __GLOBAL, Currencies}) => {
  const request = require('request');
  const fs = require('fs');

  // Get the mentioned user
  var mention = Object.keys(event.mentions)[0];
  let tag = event.mentions[mention].replace("@", "");

  // GIF links for slapping
  var link = [
    "https://i.postimg.cc/Mc7rWvFv/12334wrwd534wrdf-1.gif",
    "https://i.postimg.cc/R3LGk2Wt/12334wrwd534wrdf-2.gif",
    "https://i.postimg.cc/CRj489H2/12334wrwd534wrdf-3.gif",
    "https://i.postimg.cc/MMr0xwqn/12334wrwd534wrdf-4.gif",
    "https://i.postimg.cc/KK2Jsm8F/12334wrwd534wrdf-5.gif",
    "https://i.postimg.cc/dZLBT14R/12334wrwd534wrdf-6.gif",
    "https://i.postimg.cc/Fd1cT63N/12334wrwd534wrdf-7.gif",
    "https://i.postimg.cc/rKRjVDdM/12334wrwd534wrdf-8.gif",
    "https://i.postimg.cc/G2fsCYtS/anime-slap.gif",
    "https://i.postimg.cc/C5fnL1fM/slap-anime.gif",
    "https://i.postimg.cc/ydxStn1Z/VW0cOyL.gif"
  ];

  // Callback to send the message with the downloaded GIF
  var callback = () => api.sendMessage({
    body: `Here's a slap for you, ${tag}!\nNext time, behave yourself!`,
    mentions: [{
      tag: tag,
      id: Object.keys(event.mentions)[0]
    }],
    attachment: fs.createReadStream(__dirname + "/cache/slap.gif")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/slap.gif"));

  // Download a random slap GIF and then call the callback
  return request(encodeURI(link[Math.floor(Math.random() * link.length)]))
    .pipe(fs.createWriteStream(__dirname + "/cache/slap.gif"))
    .on("close", () => callback());
};
