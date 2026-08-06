module.exports.config = {
 'name': "rip",
 'version': "1.0.1",
 'hasPermssion': 2,
 'credits': "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 'description': "scooby doo template memes",
 'commandCategory': "Picture",
 'usages': "...",
 'cooldowns': 5,
 'dependencies': {
 'fs-extra': '',
 'axios': '',
 'canvas': '',
 'jimp': '',
 'node-superfetch': ''
 }
};

module.exports.circle = async (imageBuffer) => {
 const jimp = global.nodemodule.jimp;
 imageBuffer = await jimp.read(imageBuffer);
 imageBuffer.circle();
 return await imageBuffer.getBufferAsync("image/png");
};

module.exports.run = async ({ event, api, args, Users }) => {
 try {
 const canvas = global.nodemodule.canvas;
 const superfetch = global.nodemodule["node-superfetch"];
 const fs = global.nodemodule["fs-extra"];
 var outputPath = __dirname + "/cache/damma.jpg";
 var targetUserId = Object.keys(event.mentions)[0] || event.senderID;
 const canvasObj = canvas.createCanvas(500, 670);
 const ctx = canvasObj.getContext('2d');
 const templateImage = await canvas.loadImage("https://i.imgur.com/jHrYZ5Y.jpeg");
 var profilePicResponse = await superfetch.get("https://graph.facebook.com/" + targetUserId + "/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662");
 profilePicResponse = await this.circle(profilePicResponse.body);
 ctx.drawImage(templateImage, 0, 0, canvasObj.width, canvasObj.height);
 ctx.drawImage(await canvas.loadImage(profilePicResponse), 30, 469, 178, 178);
 const finalImageBuffer = canvasObj.toBuffer();
 fs.writeFileSync(outputPath, finalImageBuffer);
 api.sendMessage({
 'attachment': fs.createReadStream(outputPath, {
 'highWaterMark': 131072
 }),
 'body': "তুই একটা বদল\nমাথায় গোবর-গু ছাড়া কিছু নাই🤣😹"
 }, event.threadID, () => fs.unlinkSync(outputPath), event.messageID);
 } catch (error) {
 api.sendMessage(error.stack, event.threadID);
 }
};