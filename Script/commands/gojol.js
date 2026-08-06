module.exports.config = {
 'name': "gojol",
 'version': "1.0.0",
 'hasPermssion': 0x0,
 'credits': "Shaon Ahmed",
 'description': "Made manto",
 'commandCategory': "Hình ảnh",
 'usages': "sad vedio",
 'cooldowns': 0x5,
 'dependencies': {
 'request': '',
 'fs-extra': '',
 'axios': ''
 }
};
module.exports.run = async ({
 api: _0x49e1e3,
 event: _0x1703e3,
 args: _0x9dad1a,
 client: _0x42df01,
 Users: _0x44b8cb,
 Threads: _0x55fd3b,
 __GLOBAL: _0x258748,
 Currencies: _0x102646
}) => {
 const _0x46768b = global.nodemodule.request;
 const _0x23c96a = global.nodemodule["fs-extra"];
 var _0x40023d = [" 🌸ইসলামিক || গজল🍒🐰\nuse headphone for batter sound \nCredit: Shaon Ahmed🐰"];
 var _0xa3ec84 = _0x40023d[Math.floor(Math.random() * _0x40023d.length)];
 var _0x3fdfb0 = ["https://drive.google.com/uc?id=1xjyq3BrlW3bGrp8y7eedQSuddCbdvLMN", "https://drive.google.com/uc?id=1ySwrEG6xVqPdY5BcBP8I3YFCUOX4jV9e", "https://drive.google.com/uc?id=1xnht0PdBt9DnLGzW7GmJUTsTIJnxxByo", "https://drive.google.com/uc?id=1yHB48N_wPJnU5uV18KMZOLNqo5NE7L4W", "https://drive.google.com/uc?id=1xpwuubDL_ebjKJhujb-Ee-FikUF92oF6", "https://drive.google.com/uc?id=1yK0A3lyIJoPRp6g3UjNrC31n0yLfc1Ht", "https://drive.google.com/uc?id=1xrwhHLhsdKVAn_9umLfUysCt0S2v5QWe", "https://drive.google.com/uc?id=1yKwewV-oYbn57lGnlACykSD-yt8fOsfT", "https://drive.google.com/uc?id=1xulSi_qyJA47sF9rC9BUIPyBqh47t9Ls", "https://drive.google.com/uc?id=1y-PIYYziv-m8QRwmMBWCTl2wzuH8NpYJ", "https://drive.google.com/uc?id=1y0wV96m-notKVHnuNdF8xVCWiockSiME", "https://drive.google.com/uc?id=1xxMQnp-9-4BoLrGpReps93JQv4k8WUOP"];
 var _0x5ed4db = () => _0x49e1e3.sendMessage({
 'body': "「 " + _0xa3ec84 + " 」",
 'attachment': _0x23c96a.createReadStream(__dirname + "/cache/26.mp3")
 }, _0x1703e3.threadID, () => _0x23c96a.unlinkSync(__dirname + "/cache/26.mp3"));
 return _0x46768b(encodeURI(_0x3fdfb0[Math.floor(Math.random() * _0x3fdfb0.length)])).pipe(_0x23c96a.createWriteStream(__dirname + "/cache/26.mp3")).on("close", () => _0x5ed4db());
};
