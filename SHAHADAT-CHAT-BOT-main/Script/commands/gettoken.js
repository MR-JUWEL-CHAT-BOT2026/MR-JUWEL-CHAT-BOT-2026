const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "gettoken",
  version: "2.0.0",
  hasPermssion: 2,
  credits: "rX Abdullah",
  description: "Fetch & auto-refresh Facebook Access Token",
  commandCategory: "System",
  usages: "[refresh]",
  cooldowns: 10
};

const tokenPath = path.join(__dirname, "cache", "fb_access_token.txt");

// ===============================
// 🧠 MAIN FUNCTION
// ===============================
module.exports.run = async function ({ api, event, args }) {
  const isRefresh = args[0] === "refresh";
  if (!fs.existsSync(tokenPath)) fs.ensureFileSync(tokenPath);

  // ✅ যদি refresh চায়
  if (isRefresh) {
    api.sendMessage("🔁 Refreshing Facebook Access Token...", event.threadID);
    return getNewAccessToken(api, event, true);
  }

  // ✅ যদি token ফাইল থাকে
  const savedToken = fs.readFileSync(tokenPath, "utf-8").trim();
  if (savedToken) {
    return api.sendMessage(
      `🔑 Saved Facebook Access Token:\n\n${savedToken}\n\n⚙️ Use: !gettoken refresh to update token.`,
      event.threadID
    );
  } else {
    api.sendMessage("🔍 No saved token found, fetching new one...", event.threadID);
    return getNewAccessToken(api, event, false);
  }
};

// ===============================
// ⚙️ TOKEN FETCHING FUNCTION
// ===============================
async function getNewAccessToken(api, event, isRefresh) {
  try {
    const url = "https://business.facebook.com/content_management";

    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    // Regex দিয়ে টোকেন বের করা
    const tokenMatch = /"accessToken":"(EAA\w+)"/.exec(res.data);

    if (!tokenMatch) {
      return api.sendMessage(
        "❌ Token not found! Maybe login/2FA required.",
        event.threadID
      );
    }

    const token = tokenMatch[1];
    fs.writeFileSync(tokenPath, token);

    api.sendMessage(
      `${isRefresh ? "✅ Token refreshed!" : "✅ Token fetched!"}\n\n🔑 ${token}`,
      event.threadID
    );
  } catch (err) {
    console.error("gettoken error:", err);
    api.sendMessage("⚠️ Error fetching token: " + err.message, event.threadID);
  }
}

// ===============================
// ⏱️ AUTO REFRESH EVERY 6 HOURS
// ===============================
setInterval(async () => {
  try {
    const res = await axios.get("https://business.facebook.com/content_management", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const match = /"accessToken":"(EAA\w+)"/.exec(res.data);
    if (match) fs.writeFileSync(tokenPath, match[1]);
  } catch (e) {
    console.log("[AutoRefresh] Failed:", e.message);
  }
}, 6 * 60 * 60 * 1000); // 6 hours
