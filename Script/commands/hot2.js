module.exports.config = {
 name: "hot2",
 version: "1.0.0",
 hasPermssion: 2,
 credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
 description: "hot video",
 commandCategory: "admin",
 usages: "horny vedio",
 cooldowns: 5,
 dependencies: {
 request: '',
 "fs-extra": '',
 axios: ''
 }
};

module.exports.run = async function({ api, event }) {
 const request = global.nodemodule["request"];
 const fs = global.nodemodule["fs-extra"];
var videoLinks = [
"https://drive.google.com/uc?export=download&id=12a2ZD1kq0_lq2SYQD-otE3UNPWpA44CL",
"https://drive.google.com/uc?export=download&id=1mmER1zNzwD28RQedfUI6z-mUctZpAypY",
"https://drive.google.com/uc?export=download&id=1s2q9cZeu_E0YS1SBaJB9EmDyeWJO4NJB",
"https://drive.google.com/uc?export=download&id=1AxoAzqvhuHjetOZg_nOFQ4YPI49vBJHA",
"https://drive.google.com/uc?export=download&id=1EUMGtoVduVv14HrGZu2ztLOoJQSDMyTl",
"https://drive.google.com/uc?export=download&id=1K0yBKMUmm8edJFPhAUcEsd60T6piWqvT",
"https://drive.google.com/uc?export=download&id=1jHY3b65oI9BK1XKwbG3UCyZYtHya4Daw",
"https://drive.google.com/uc?export=download&id=1WgAAojDA3hUIr8HSHqaMn5ChbR3MZyfI",
"https://drive.google.com/uc?export=download&id=1axmlgaCo3UAjccc_1k_7a5MeSP7j9P_2",
"https://drive.google.com/uc?export=download&id=1YkxNkHqLmNk9evflMA3tLWg2-uAJZWyN",
"https://drive.google.com/uc?export=download&id=1Mh7RX6_S9Yc_GDEA9xpxNJTZSdHdDcp1",
"https://drive.google.com/uc?export=download&id=10UL6XxJnfouUx0zVhB1xQH1bKbluiWQd",
"https://drive.google.com/uc?export=download&id=1_rn3_8Bmkoe_fUnHHoNa_h4sZwbdjKAc",
"https://drive.google.com/uc?export=download&id=1qPCr-2czy2i3jhyAi7lrv1AAQiidlcJn",
"https://drive.google.com/uc?export=download&id=1OQZY6Fra5PTYUwJzllwLXGkPDXyIFLLO",
"https://drive.google.com/uc?export=download&id=1hDlG6xdM8l-4ynhYuRloMDIXSo4CYg08",
"https://drive.google.com/uc?export=download&id=1e-ekdWyVdX0AWsjmjrfWbxAinM2a_RgH",
"https://drive.google.com/uc?export=download&id=1FMN4dVRPlW8Nov0qZ_9qMhzd_WmTaMoX",
"https://drive.google.com/uc?export=download&id=1vQJMqBeSg0bRaiZVpgu0DKN7fghALzpq",
"https://drive.google.com/uc?export=download&id=1vv3JnCb1l9XEnUFRMoRLnEukkaHOOiIN",
"https://drive.google.com/uc?export=download&id=1MPbHGTAJi0cBNuyXKXmnzMRmDqW9ZsYS",
"https://drive.google.com/uc?export=download&id=1XXDs8MkMUX-CtQrZsQQhVU_mz2MC4QPN",
"https://drive.google.com/uc?export=download&id=10lm2foxn2pxl5TWkTRJfRRRcuYOM9X0C",
"https://drive.google.com/uc?export=download&id=1TpAEBX1WJn5XZGackS0KmuFuTbOfxy4D",
"https://drive.google.com/uc?export=download&id=1k5S1q0lm8ZTQcQfVNvH3B7MsmmAXIouh",
"https://drive.google.com/uc?export=download&id=1hrYXt_hSuw_Ys9WHqzYb9-pBSdGJTdQs",
"https://drive.google.com/uc?export=download&id=1O3umDG248bNukoEw76ZyNL43x3as3_Tz",
"https://drive.google.com/uc?export=download&id=1Mi93zAPFkaT12GkX3NXL1LjADCbRpDMZ",
"https://drive.google.com/uc?export=download&id=1ssxX1mt_N6TQ8hV2Xm32rM0RFR-zY3DY",
"https://drive.google.com/uc?export=download&id=1XwMbUnz2wKh9T6QZbcRUIsGTa6Xr5xr0",
"https://drive.google.com/uc?export=download&id=1xmvWnxFUVNMtOHlp8_usBvwmyvS8ON8L",
"https://drive.google.com/uc?export=download&id=1sbTzwZskQEo5_wR0psCdLo5Ley4eUJ_z",
"https://drive.google.com/uc?export=download&id=1TsDNWfh3fBQh00e3pkr53Mlm6llfMSKt",
"https://drive.google.com/uc?export=download&id=1nK3m7L51wletqsVHINr6EeWadThxGb0U",
"https://drive.google.com/uc?export=download&id=13LHaKS9sUCirvplSxLnx7blo5ClEcqjk",
"https://drive.google.com/uc?export=download&id=1ebuMn6MIrVPKTspxuIrUj7ZjSg7HOYt0",
"https://drive.google.com/uc?export=download&id=1xCfdTKQ45SAStcyy9ixel0Jkoav2VJ2g",
"https://drive.google.com/uc?export=download&id=1pmLJAU__shHqnuyibggvU7fuwvadEf-A",
"https://drive.google.com/uc?export=download&id=1MZ7TplDsALX0sK_oC6rv-zrXGbM2I3Aa",
"https://drive.google.com/uc?export=download&id=1qR3pvcjscpagMLIOs7F-xlgdHl04MZjo",
"https://drive.google.com/uc?export=download&id=1wKDemUsxk-E1-ol-qoX9aUMMryxG8pUl",
"https://drive.google.com/uc?export=download&id=1KuYf09bfM2TD6ruYbwHQctGFnhxOp0tB",
"https://drive.google.com/uc?export=download&id=1FhU20PMXrqaP_OGYqMfPKUDuYmAEBXd1",
"https://drive.google.com/uc?export=download&id=1U1itxBTuv8qMp9Zzo9DLLhLIyNxZO10E",
"https://drive.google.com/uc?export=download&id=1Q79NgaQOFwfF-yHxiMHT5vE-fuXsOP6h",
"https://drive.google.com/uc?export=download&id=1kq66LLo8nA-lC9PSela46AdZcQBZHuTT",
"https://drive.google.com/uc?export=download&id=1A8FMLiLz_egexghVgmTMXhPvegfdpTXg",
"https://drive.google.com/uc?export=download&id=1gS2H_pJKvIgxetfNEkRur0_dEt3Qjqu6",
"https://drive.google.com/uc?export=download&id=1M79lr2o-jfSXKFtB22SFARWaWdrnMfEL",
"https://drive.google.com/uc?export=download&id=1q3eiMmKUVcdIDJBqSCizId5W-FypJXK6",
"https://drive.google.com/uc?export=download&id=1z6J6QqhoAPv1SgzmSy_LOjHfE4d48hs9",
"https://drive.google.com/uc?export=download&id=1sDsckq1wt-YYBedJLHeTZK7ntalqvDEs",
"https://drive.google.com/uc?export=download&id=1G0M20cZVuXXHii-cKZAsLI-LLgg5IeEb",
"https://drive.google.com/uc?export=download&id=1X0h049ECLpTLLzlgoQfjEkxB69e3ForO",
"https://drive.google.com/uc?export=download&id=12GtFGG9rhqabj2oB0J0Dt5cUu2s0gABB",
"https://drive.google.com/uc?export=download&id=1p9A75ajUJcDm1UQBADN3h3vKnG4WKTMz",
"https://drive.google.com/uc?export=download&id=18lsuXWcxiK_UxTXWZaF-Ti8C4VHvYQ9w",
"https://drive.google.com/uc?export=download&id=1Qdv0xenyM99gMfWdwB-kq7mdIAE9-kOK",
"https://drive.google.com/uc?export=download&id=14mNAlbfbBPINHDnca8ATSsw32Pu67rhG",
"https://drive.google.com/uc?export=download&id=1WaOCMHHZI-6OcF5xu8pG6cmAiI9lDQeE",
"https://drive.google.com/uc?export=download&id=1CJAjMVpgy70Z9KAsILUplBhp3NM4kqCb",
"https://drive.google.com/uc?export=download&id=1lt4LGDc17Mgk4_afha-pMEu9UC_aSwMx",
"https://drive.google.com/uc?export=download&id=1NwipOKe_FRF3GhtoCn8k3kqwMgdLFiqj",
"https://drive.google.com/uc?export=download&id=1HebDETA0FJxx4PZm4j7rCRAuOqDEyNUw",
"https://drive.google.com/uc?export=download&id=1PcR7-WWLYqqqI70RcYVm3n2_Z659m-56",
"https://drive.google.com/uc?export=download&id=1HgkCMkLqE4YAPFUeEweGo_RlsPyYvgSX",
"https://drive.google.com/uc?export=download&id=1x1CRO6whbuea545Sfex0Rd-H8ro0OKlW",
"https://drive.google.com/uc?export=download&id=1MsZolqm1gtEQ4YCX4LWi0xSYZ7znQIDK",
"https://drive.google.com/uc?export=download&id=14cUUkb_W-FdMkN_zZJo-WQAoOvIEWZ77",
"https://drive.google.com/uc?export=download&id=11528TW4oAome48Ca8D2Zog1P5c7MXeIH",
"https://drive.google.com/uc?export=download&id=1f6-F0WPa17cd9sysRFFZyDPxk33mHDiy",
"https://drive.google.com/uc?export=download&id=1ZjnoHgo1R9lqFWdrx53n4x6E4ih0v0FU",
"https://drive.google.com/uc?export=download&id=1HGLMeZXAIVJMg4kRrzvHj4DvUdWwdqsE",
"https://drive.google.com/uc?export=download&id=1UiFDDfsgj4RS1KPon3rylju0XmnXURcj",
"https://drive.google.com/uc?export=download&id=1_GCvrwAZEO1QJ1lJcO9DBoAzGIFMVxep",
"https://drive.google.com/uc?export=download&id=1sYo29R91scjd_Sr_O7bmw8pUorMN1EkU",
"https://drive.google.com/uc?export=download&id=1pPJz97LTU6RllXsQDiVkl-B628CDbxXE",
"https://drive.google.com/uc?export=download&id=1EORsC6u_j-WzOyzg6-uwkBnfSYEX7R_G",
"https://drive.google.com/uc?export=download&id=1BQ9fQQqDOlRyRguwsLj1MoeLIG0uvWUC",
"https://drive.google.com/uc?export=download&id=1Dj7Ka9G9Qpy4jEbjEOyFuV-sU7PqKWa7",
"https://drive.google.com/uc?export=download&id=1DH4ab7DDjjhbhIwcvJpNkoW7s0ZvN7ti",
"https://drive.google.com/uc?export=download&id=1p3pCwsCXyBe7VIOHFv0VZFwcaou1JAXo",
"https://drive.google.com/uc?export=download&id=1uy54ns0BfnEus14PYwrsfpZW2yMhW-EB",
"https://drive.google.com/uc?export=download&id=1SwTgeSdAUEgWS1tsQYvo-qG2j_k9LUY5",
"https://drive.google.com/uc?export=download&id=1DQSNe6-xsPc1SqqWjVRRYQfN9OgmUX5P"
];
 

 const path = __dirname + "/cache/hotvideo.mp4";
 const randomLink = videoLinks[Math.floor(Math.random() * videoLinks.length)];

 request(encodeURI(randomLink))
 .pipe(fs.createWriteStream(path))
 .on("close", () => {
 api.sendMessage({
 body: " hot2___𝗠𝗥 𝗝𝗨𝗪𝗘𝗟 ",
 attachment: fs.createReadStream(path)
 }, event.threadID, () => fs.unlinkSync(path));
 });
};
