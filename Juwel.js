const { spawn } = require("child_process");
const axios = require("axios");
const express = require('express');
const path = require('path');
const fs = require('fs');

// ======================== বিগটেক্সট ASCII আর্ট ======================== //
const BIGTEXT_ASCII = `
███╗░░░███╗██████╗░░░░
████╗░████║██╔══██╗░░░
██╔████╔██║██████╔╝░░░
██║╚██╔╝██║██╔══██╗░░░
██║░╚═╝░██║██║░░██║██╗
╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝

░░░░░██╗██╗░░░██╗░██╗░░░░░░░██╗███████╗██╗░░░░░
░░░░░██║██║░░░██║░██║░░██╗░░██║██╔════╝██║░░░░░
░░░░░██║██║░░░██║░╚██╗████╗██╔╝█████╗░░██║░░░░░
██╗░░██║██║░░░██║░░████╔═████║░██╔══╝░░██║░░░░░
╚█████╔╝╚██████╔╝░░╚██╔╝░╚██╔╝░███████╗███████╗
░╚════╝░░╚═════╝░░░░╚═╝░░░╚═╝░░╚══════╝╚══════╝
`;

// ======================== লগার সেটআপ ======================== //
if (!fs.existsSync('./utils')) {
    fs.mkdirSync('./utils', { recursive: true });
}

const logger = (message, type = "[ INFO ]") => {
    const timestamp = new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' });
    console.log(`[${timestamp}] [BIGTEXT] ${type} ${message}`);
    
    const logMessage = `[${timestamp}] [BIGTEXT] ${type} ${message}\n`;
    fs.appendFileSync('./utils/bot.log', logMessage, 'utf8');
};

// ======================== কনফিগারেশন ======================== //
const CONFIG = {
    PORT: process.env.PORT || 8080,
    MAX_RESTARTS: 5,
    RESTART_DELAY: 3000,
    MAIN_FILE: "Main.js",
    GITHUB_REPO: "https://raw.githubusercontent.com/MR-JUWEL-CHAT-BOT2026/MR-JUWEL-CHAT-BOT-2026/main/package.json",
    BOT_NAME: "MR JUWEL CHAT BOT",
    REPO_URL: "https://github.com/MR-JUWEL-CHAT-BOT2026/MR-JUWEL-CHAT-BOT-2026.git"
};

global.countRestart = global.countRestart || 0;
let currentChild = null;
let isShuttingDown = false;

// ======================== কুকি ম্যানেজার (সরল) ======================== //
class CookieManager {
    constructor() {
        this.cookieFile = './utils/cookies.json';
        this.cookies = {};
        this.loadCookies();
    }

    loadCookies() {
        try {
            if (fs.existsSync(this.cookieFile)) {
                const data = fs.readFileSync(this.cookieFile, 'utf8');
                this.cookies = JSON.parse(data);
                logger(`${Object.keys(this.cookies).length} টি কুকি লোড করা হয়েছে`, "[ 🍪 COOKIES LOADED ]");
            } else {
                this.cookies = {};
                this.saveCookies();
                logger('নতুন কুকি ফাইল তৈরি করা হয়েছে', "[ 🍪 NEW COOKIE FILE ]");
            }
        } catch (error) {
            logger(`কুকি লোড করতে ব্যর্থ: ${error.message}`, "[ ❌ COOKIE ERROR ]");
            this.cookies = {};
        }
    }

    saveCookies() {
        try {
            if (!fs.existsSync('./utils')) {
                fs.mkdirSync('./utils', { recursive: true });
            }
            fs.writeFileSync(this.cookieFile, JSON.stringify(this.cookies, null, 2), 'utf8');
        } catch (error) {
            logger(`কুকি সেভ করতে ব্যর্থ: ${error.message}`, "[ ❌ COOKIE SAVE ERROR ]");
        }
    }

    setCookie(name, value, maxAge = 86400000) {
        this.cookies[name] = {
            value: value,
            createdAt: Date.now(),
            expiresAt: Date.now() + maxAge
        };
        this.saveCookies();
        logger(`কুকি সেট করা হয়েছে: ${name}`, "[ 🍪 COOKIE SET ]");
        return true;
    }

    getCookie(name) {
        const cookie = this.cookies[name];
        if (!cookie) return null;

        // মেয়াদ চেক
        if (cookie.expiresAt && Date.now() > cookie.expiresAt) {
            logger(`⚠️ কুকির মেয়াদ শেষ: ${name}`, "[ ⚠️ COOKIE EXPIRED ]");
            delete this.cookies[name];
            this.saveCookies();
            return null;
        }
        return cookie.value;
    }

    deleteCookie(name) {
        delete this.cookies[name];
        this.saveCookies();
        logger(`কুকি ডিলিট করা হয়েছে: ${name}`, "[ 🍪 COOKIE DELETED ]");
    }

    getAllCookies() {
        const result = {};
        for (const [name, cookie] of Object.entries(this.cookies)) {
            if (cookie.expiresAt && Date.now() > cookie.expiresAt) {
                // মেয়াদ শেষ, বাদ দাও
                continue;
            }
            result[name] = cookie.value;
        }
        return result;
    }

    getCookieStatus(name) {
        const cookie = this.cookies[name];
        if (!cookie) return { exists: false, status: 'not_found' };

        if (cookie.expiresAt) {
            const timeLeft = cookie.expiresAt - Date.now();
            if (timeLeft < 0) {
                return { 
                    exists: true, 
                    status: 'expired',
                    timeLeft: 'মেয়াদ শেষ'
                };
            } else {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                
                return {
                    exists: true,
                    status: 'valid',
                    timeLeft: `${days}দি ${hours}ঘ ${minutes}মি`
                };
            }
        }
        
        return {
            exists: true,
            status: 'permanent',
            timeLeft: 'স্থায়ী'
        };
    }

    checkExpiredCookies() {
        const expired = [];
        for (const [name, cookie] of Object.entries(this.cookies)) {
            if (cookie.expiresAt && Date.now() > cookie.expiresAt) {
                expired.push(name);
            }
        }
        return expired;
    }
}

// ======================== কুকি ইনিশিয়ালাইজ ======================== //
const cookieManager = new CookieManager();

// ======================== ওয়েব সার্ভার ======================== //
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ======================== হোম পেজ ======================== //
app.get('/', (req, res) => {
    const allCookies = cookieManager.getAllCookies();
    const expiredCookies = cookieManager.checkExpiredCookies();
    const cookieStatus = Object.keys(cookieManager.cookies).map(name => ({
        name: name,
        ...cookieManager.getCookieStatus(name)
    }));

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>MR JUWEL CHAT BOT - BIGTEXT</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }
                .container {
                    background: rgba(255,255,255,0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    max-width: 900px;
                    width: 100%;
                    margin: 20px auto;
                }
                .ascii-art {
                    color: #00d4ff;
                    font-family: monospace;
                    font-size: 10px;
                    white-space: pre;
                    text-align: center;
                    line-height: 1.1;
                    overflow-x: auto;
                }
                h1 { font-size: 2em; margin: 10px 0; }
                .developer { 
                    font-size: 1.2em; 
                    color: #ffd700; 
                    margin: 10px 0 20px 0;
                }
                .status { 
                    background: #00d4ff; 
                    padding: 8px 20px; 
                    border-radius: 30px;
                    display: inline-block;
                    margin: 10px 0;
                    font-weight: bold;
                    color: #333;
                }
                .section {
                    background: rgba(0,0,0,0.2);
                    padding: 15px;
                    border-radius: 10px;
                    margin: 15px 0;
                    text-align: left;
                }
                .cookie-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .cookie-item:last-child { border-bottom: none; }
                .status-valid { color: #00ff88; }
                .status-expired { color: #ff4444; }
                .status-permanent { color: #ffd700; }
                .alert {
                    padding: 10px;
                    border-radius: 5px;
                    margin: 10px 0;
                }
                .alert-danger { background: #ff444422; border: 1px solid #ff4444; }
                .alert-success { background: #00ff8822; border: 1px solid #00ff88; }
                .footer {
                    margin-top: 20px;
                    opacity: 0.8;
                    font-size: 0.9em;
                }
                .badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    margin: 3px;
                    font-size: 0.8em;
                    background: #ff6b6b;
                }
                .badge-bigtext { background: #00d4ff; color: #333; }
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                @media (max-width: 600px) {
                    .grid-2 { grid-template-columns: 1fr; }
                    .ascii-art { font-size: 7px; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="ascii-art">${BIGTEXT_ASCII}</div>
                <h1>🤖 MR JUWEL CHAT BOT</h1>
                <div class="developer">⚡ Developed by <strong>MR JUWEL</strong></div>
                <div class="status">✅ বট চালু আছে</div>
                
                <div class="section">
                    <h3>🍪 কুকি স্ট্যাটাস</h3>
                    <div class="grid-2">
                        <div class="cookie-item">
                            <span>📊 মোট কুকি:</span>
                            <span>${Object.keys(cookieManager.cookies).length}</span>
                        </div>
                        <div class="cookie-item">
                            <span>✅ সক্রিয়:</span>
                            <span class="status-valid">${Object.keys(allCookies).length}</span>
                        </div>
                        <div class="cookie-item">
                            <span>❌ মেয়াদোত্তীর্ণ:</span>
                            <span class="status-expired">${expiredCookies.length}</span>
                        </div>
                    </div>
                    
                    ${expiredCookies.length > 0 ? `
                    <div class="alert alert-danger">
                        ⚠️ ${expiredCookies.length} টি কুকির মেয়াদ শেষ হয়েছে!
                        <br><small>${expiredCookies.join(', ')}</small>
                    </div>
                    ` : `
                    <div class="alert alert-success">
                        ✅ সব কুকি বৈধ আছে!
                    </div>
                    `}
                    
                    <hr style="border-color:rgba(255,255,255,0.2); margin:10px 0;">
                    
                    ${cookieStatus.map(cookie => `
                    <div class="cookie-item">
                        <span>🍪 <strong>${cookie.name}</strong></span>
                        <span class="status-${cookie.status}">
                            ${cookie.status === 'valid' ? '✅ বৈধ' : 
                              cookie.status === 'expired' ? '❌ মেয়াদ শেষ' : 
                              '♾️ স্থায়ী'}
                            ${cookie.timeLeft && cookie.status !== 'expired' ? ` (${cookie.timeLeft})` : ''}
                        </span>
                    </div>
                    `).join('')}
                    
                    ${cookieStatus.length === 0 ? '<div style="color:#999; text-align:center;">কোন কুকি নেই</div>' : ''}
                </div>

                <div class="section">
                    <h3>📊 বট তথ্য</h3>
                    <div class="grid-2">
                        <div class="cookie-item"><span>🔄 রিস্টার্ট কাউন্ট:</span><span>${global.countRestart}</span></div>
                        <div class="cookie-item"><span>⏱️ আপটাইম:</span><span>${Math.floor(process.uptime())} সেকেন্ড</span></div>
                        <div class="cookie-item"><span>🌐 পোর্ট:</span><span>${CONFIG.PORT}</span></div>
                        <div class="cookie-item"><span>👨‍💻 ডেভেলপার:</span><span>BIGTEXT</span></div>
                    </div>
                </div>

                <div>
                    <span class="badge">Node.js</span>
                    <span class="badge">Express</span>
                    <span class="badge">Auto-Restart</span>
                    <span class="badge badge-bigtext">⚡ BIGTEXT</span>
                </div>
                
                <div class="footer">
                    <p>🔹 বট স্বয়ংক্রিয়ভাবে চলছে | 📊 মনিটরিং সক্রিয়</p>
                    <p>👨‍💻 Developed with ❤️ by <strong>BIGTEXT</strong></p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// ======================== কুকি API ======================== //
app.get('/api/cookies', (req, res) => {
    const allCookies = cookieManager.getAllCookies();
    const expired = cookieManager.checkExpiredCookies();
    
    res.json({
        success: true,
        total: Object.keys(cookieManager.cookies).length,
        valid: Object.keys(allCookies).length,
        expired: expired.length,
        expiredList: expired,
        cookies: allCookies
    });
});

app.post('/api/cookies/set', (req, res) => {
    const { name, value, maxAge } = req.body;
    if (!name || !value) {
        return res.status(400).json({
            success: false,
            message: 'নাম এবং মান প্রয়োজন'
        });
    }

    cookieManager.setCookie(name, value, maxAge || 86400000);
    res.json({
        success: true,
        message: `কুকি সেট করা হয়েছে: ${name}`
    });
});

app.delete('/api/cookies/:name', (req, res) => {
    const { name } = req.params;
    cookieManager.deleteCookie(name);
    res.json({
        success: true,
        message: `কুকি ডিলিট করা হয়েছে: ${name}`
    });
});

app.get('/api/cookies/check/:name', (req, res) => {
    const { name } = req.params;
    const status = cookieManager.getCookieStatus(name);
    res.json({
        success: true,
        name: name,
        ...status
    });
});

// ======================== হেলথ চেক ======================== //
app.get('/health', (req, res) => {
    const allCookies = cookieManager.getAllCookies();
    const expired = cookieManager.checkExpiredCookies();
    
    res.json({
        status: 'running',
        botName: CONFIG.BOT_NAME,
        developer: 'BIGTEXT',
        restartCount: global.countRestart,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        repo: CONFIG.REPO_URL,
        cookies: {
            total: Object.keys(cookieManager.cookies).length,
            valid: Object.keys(allCookies).length,
            expired: expired.length,
            expiredList: expired
        }
    });
});

// ======================== বট ম্যানেজার ======================== //
function startBot(message) {
    if (isShuttingDown) return;
    if (message) logger(message, "[ 🔄 STARTING ]");
    
    const options = {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true,
        env: {
            ...process.env,
            NODE_ENV: process.env.NODE_ENV || 'production'
        }
    };

    try {
        currentChild = spawn("node", [
            "--trace-warnings", 
            "--async-stack-traces", 
            CONFIG.MAIN_FILE
        ], options);

        logger(`${CONFIG.BOT_NAME} প্রসেস শুরু হয়েছে (PID: ${currentChild.pid})`, "[ ✅ BOT STARTED ]");

        currentChild.on("close", (codeExit) => {
            if (isShuttingDown) {
                logger(`বট বন্ধ করা হচ্ছে (PID: ${currentChild.pid})`, "[ ⏹️ SHUTDOWN ]");
                return;
            }

            if (codeExit !== 0 && global.countRestart < CONFIG.MAX_RESTARTS) {
                global.countRestart += 1;
                logger(`বট বন্ধ হয়েছে (কোড: ${codeExit})। পুনরায় চালু হচ্ছে... (${global.countRestart}/${CONFIG.MAX_RESTARTS})`, "[ 🔄 RESTARTING ]");
                
                setTimeout(() => {
                    startBot();
                }, CONFIG.RESTART_DELAY);
                
            } else if (codeExit !== 0) {
                logger(`${CONFIG.BOT_NAME} ${CONFIG.MAX_RESTARTS} বার চেষ্টা করে ব্যর্থ হয়েছে।`, "[ ❌ STOPPED ]");
            } else {
                logger(`${CONFIG.BOT_NAME} স্বাভাবিকভাবে বন্ধ হয়েছে`, "[ ✅ CLEAN EXIT ]");
                global.countRestart = 0;
            }
        });

        currentChild.on("error", (error) => {
            if (isShuttingDown) return;
            logger(`বট প্রসেস ত্রুটি: ${error.message}`, "[ ❌ PROCESS ERROR ]");
            
            if (global.countRestart < CONFIG.MAX_RESTARTS) {
                global.countRestart += 1;
                setTimeout(() => {
                    startBot();
                }, CONFIG.RESTART_DELAY);
            }
        });

    } catch (error) {
        logger(`বট চালু করতে ব্যর্থ: ${error.message}`, "[ ❌ FATAL ERROR ]");
        if (global.countRestart < CONFIG.MAX_RESTARTS) {
            global.countRestart += 1;
            setTimeout(() => {
                startBot();
            }, CONFIG.RESTART_DELAY);
        }
    }
}

// ======================== গিটহাব আপডেট চেক ======================== //
async function checkForUpdates() {
    try {
        const response = await axios.get(CONFIG.GITHUB_REPO, {
            timeout: 5000,
            headers: {
                'User-Agent': 'MR-JUWEL-CHAT-BOT-BIGTEXT'
            }
        });
        
        if (response.data) {
            logger(`📦 নাম: ${response.data.name || 'MR JUWEL CHAT BOT'}`, "[ 📦 PACKAGE ]");
            logger(`📌 ভার্সন: ${response.data.version || 'অজানা'}`, "[ 📌 VERSION ]");
            
            try {
                const localPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
                if (localPackage.version !== response.data.version) {
                    logger(`⚠️ নতুন ভার্সন পাওয়া গেছে! (${localPackage.version} → ${response.data.version})`, "[ 🔔 UPDATE ]");
                } else {
                    logger(`✅ বট আপ-টু-ডেট (ভার্সন ${response.data.version})`, "[ ✅ UP-TO-DATE ]");
                }
            } catch (err) {
                // লোকাল package.json না থাকলে
            }
        }
    } catch (error) {
        logger(`আপডেট চেক ব্যর্থ: ${error.message}`, "[ ❌ UPDATE ERROR ]");
    }
}

// ======================== গ্রেসফুল শাটডাউন ======================== //
function gracefulShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    
    logger(`শাটডাউন সংকেত পেয়েছি: ${signal}`, "[ ⏹️ SHUTDOWN SIGNAL ]");
    
    server.close(() => {
        logger('ওয়েব সার্ভার বন্ধ করা হয়েছে', "[ ⏹️ SERVER CLOSED ]");
    });

    if (currentChild && !currentChild.killed) {
        logger(`বট প্রসেস বন্ধ করা হচ্ছে (PID: ${currentChild.pid})`, "[ ⏹️ KILLING BOT ]");
        currentChild.kill('SIGTERM');
        
        setTimeout(() => {
            if (currentChild && !currentChild.killed) {
                currentChild.kill('SIGKILL');
                logger('বট ফোর্স কিল করা হয়েছে', "[ ⏹️ FORCE KILL ]");
            }
        }, 5000);
    }

    setTimeout(() => {
        logger(`${CONFIG.BOT_NAME} বন্ধ হচ্ছে...`, "[ ⏹️ EXITING ]");
        process.exit(0);
    }, 1000);
}

// ======================== সিগন্যাল হ্যান্ডলার ======================== //
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

process.on('uncaughtException', (error) => {
    logger(`অব্যাহত ত্রুটি: ${error.message}`, "[ ❌ UNCAUGHT EXCEPTION ]");
    logger(error.stack, "[ 📊 STACK TRACE ]");
});

process.on('unhandledRejection', (reason, promise) => {
    logger(`অব্যাহত প্রতিশ্রুতি বাতিল: ${reason}`, "[ ❌ UNHANDLED REJECTION ]");
});

// ======================== সার্ভার স্টার্ট ======================== //
const server = app.listen(CONFIG.PORT, () => {
    console.log(BIGTEXT_ASCII);
    logger(`🚀 ${CONFIG.BOT_NAME} - Developed by BIGTEXT`, "[ 🚀 STARTED ]");
    logger(`📊 ড্যাশবোর্ড: http://localhost:${CONFIG.PORT}`, "[ 🌐 DASHBOARD ]");
    logger(`🍪 কুকি ফাইল: ${cookieManager.cookieFile}`, "[ 📁 COOKIE FILE ]");
    
    // বট স্টার্ট
    setTimeout(() => {
        startBot(`🤖 ${CONFIG.BOT_NAME} শুরু হচ্ছে...`);
    }, 1000);
    
    // আপডেট চেক
    checkForUpdates();
    
    // প্রতি ৫ মিনিটে কুকি চেক
    setInterval(() => {
        const expired = cookieManager.checkExpiredCookies();
        if (expired.length > 0) {
            logger(`⚠️ ${expired.length} টি কুকির মেয়াদ শেষ হয়েছে: ${expired.join(', ')}`, "[ ⚠️ EXPIRED COOKIES ]");
        }
    }, 5 * 60 * 1000);
});

// ======================== লগ ফাইল ক্লিনআপ ======================== //
function cleanLogFile() {
    const logPath = './utils/bot.log';
    if (fs.existsSync(logPath)) {
        const stats = fs.statSync(logPath);
        const fileSizeInMB = stats.size / (1024 * 1024);
        if (fileSizeInMB > 10) {
            fs.truncateSync(logPath, 0);
            logger('লগ ফাইল ক্লিন করা হয়েছে', "[ 🧹 LOG CLEAN ]");
        }
    }
}

setInterval(cleanLogFile, 3600000);

// ======================== এক্সপোর্ট ======================== //
module.exports = {
    startBot,
    checkForUpdates,
    gracefulShutdown,
    logger,
    CONFIG,
    cookieManager
};