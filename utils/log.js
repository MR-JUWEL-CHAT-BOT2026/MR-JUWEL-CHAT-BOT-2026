"use strict";

/**
 * ============================================================
 *  Rahat Bot — Premium Console Logger
 * ============================================================
 * এই ফাইলটা সরাসরি পুরনো utils/log.js এর জায়গায় বসবে। বাকি
 * কোডবেজের কোনো ফাইল ছোঁয়া লাগে নাই — কারণ এটা আগের মতোই
 * এক্সপোর্ট করে:
 *
 *   const logger = require("./utils/log.js");
 *   logger(message, level)          -> সাধারণ লগ
 *   logger.loader(message, level)   -> কমান্ড/ইভেন্ট লোডার লগ
 *   logger.LOG_FILE                 -> ফাইলের পাথ (আগের মতোই)
 *
 * নতুন যা যোগ হলো (সব optional, পুরনো কল-সাইট ভাঙবে না):
 *   logger.info / logger.success / logger.warn / logger.error(msg)
 *   logger.system(msg)              -> সিস্টেম/স্টার্টআপ লাইন
 *   logger.banner(title, subtitle)  -> সুন্দর বক্স-স্টাইল ব্যানার
 *   logger.box(title)               -> সেকশন ডিভাইডার
 *
 * ============================================================
 *  মূল উন্নতিগুলো (কেন আগের লগ "খারাপ দেখা যেত"):
 * ============================================================
 * ১) প্রতিটা কমান্ড/ইভেন্ট লোড হওয়ার সময় ("Successfully installed
 *    module xyz") আলাদা আলাদা লাইন প্রিন্ট হতো — ২৫০+ কমান্ড মানে
 *    ২৫০+ লাইনের স্প্যাম। এখন এই একই প্যাটার্নের লাইনগুলো একটা
 *    লাইভ প্রোগ্রেস লাইনে (TTY কনসোলে) বা সম্পূর্ণ নিরবে (হোস্টিং
 *    লগ ভিউয়ারে, যেখানে \r ঠিকভাবে কাজ করে না) কাউন্ট হয় — কনসোল
 *    পরিষ্কার থাকে, কিন্তু প্রতিটা এন্ট্রি এখনো bot.log ফাইলে পুরোপুরি
 *    সেভ থাকে (কিচ্ছু হারায় না)।
 * ২) একই মেসেজ পরপর কয়েকবার আসলে (যেমন আগে "Rahat Bot" ৫ বার
 *    ছাপা হতো) — এখন একটা লাইনে "×৫" ব্যাজ দেখিয়ে কোলাপ্স হয়।
 * ৩) প্রতিটা লাইনে এখন টাইমস্ট্যাম্প + রঙিন আইকন + লেভেল ট্যাগ থাকে,
 *    তাই কনসোল স্ক্রল করলেও চোখে সহজে ধরা পড়ে কোনটা error/warn/success।
 * ৪) "━━━━━━━━━" জাতীয় ম্যানুয়াল ডিভাইডার লাইনগুলো অটো-ডিটেক্ট
 *    হয়ে সুন্দর বক্স বর্ডারে রেন্ডার হয়।
 * ============================================================
 */

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------
// ফাইল লগিং (সব লাইন সবসময় এখানে পূর্ণ বিস্তারিতভাবে জমা থাকে)
// ---------------------------------------------------------------
const LOG_DIR = path.join(__dirname, "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "bot.log");
const isTTY = !!(process.stdout && process.stdout.isTTY);
const columns = (process.stdout && process.stdout.columns) || 80;

function ensureLogDir() {
	try {
		if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
	} catch (_) { /* ignore */ }
}

function appendToFile(line) {
	try {
		ensureLogDir();
		const timestamp = new Date().toISOString();
		fs.appendFileSync(LOG_FILE, `[${timestamp}] ${line}\n`);
	} catch (_) {
		// ফাইলে লেখা fail করলেও বট থামবে না, শুধু console এ দেখাবে
	}
}

function stripColor(text) {
	return String(text).replace(/\x1b\[[0-9;]*m/g, "");
}

function timeNow() {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ---------------------------------------------------------------
// লেভেল স্টাইল টেবিল — আইকন + রঙ + লেবেল
// ---------------------------------------------------------------
const LEVELS = {
	info:      { icon: "ℹ️ ",  label: "INFO",     color: "#33c3ff" },
	success:   { icon: "✅",  label: "SUCCESS",  color: "#33ff8c" },
	successful:{ icon: "✅",  label: "SUCCESS",  color: "#33ff8c" },
	warn:      { icon: "⚠️ ",  label: "WARN",     color: "#ffd93d" },
	warning:   { icon: "⚠️ ",  label: "WARN",     color: "#ffd93d" },
	error:     { icon: "❌",  label: "ERROR",    color: "#ff4d5e" },
	loader:    { icon: "📦",  label: "LOADER",   color: "#33ffc9" },
	system:    { icon: "🖥️ ",  label: "SYSTEM",   color: "#c792ea" },
	database:  { icon: "💾",  label: "DATABASE", color: "#4dd0e1" },
	globalban: { icon: "🛡️ ",  label: "GLOBAL BAN", color: "#ff8a65" },
	broadcast: { icon: "📢",  label: "BROADCAST", color: "#ba68c8" },
	restart:   { icon: "🔄",  label: "RESTART",  color: "#ffb74d" },
	stopped:   { icon: "🛑",  label: "STOPPED",  color: "#ff4d5e" },
	starting:  { icon: "🚀",  label: "STARTING", color: "#33ff8c" },
	license:   { icon: "🔐",  label: "LICENSE",  color: "#ba68c8" },
	rahatbot:  { icon: "🔰",  label: "RAHAT BOT", color: "#00e5ff" },
	name:      { icon: "🔰",  label: "BOT",       color: "#00e5ff" },
	version:   { icon: "🏷️ ",  label: "VERSION",  color: "#4dd0e1" },
	description:{icon: "📄",  label: "INFO",     color: "#33c3ff" },
	updateerror:{icon: "⚠️ ",  label: "UPDATE",   color: "#ffd93d" },
};

// "[ GLOBAL BAN ]", "[ DATABASE ]", "ERROR" ইত্যাদি normalize করে
// উপরের টেবিলের সাথে ম্যাচ করে
function resolveLevel(rawLevel) {
	if (!rawLevel) return null;
	const key = String(rawLevel)
		.toLowerCase()
		.replace(/[\[\]]/g, "")
		.trim()
		.replace(/\s+/g, "");
	return LEVELS[key] || null;
}

function fallbackStyle(rawLevel) {
	return {
		icon: "•",
		label: rawLevel ? String(rawLevel).replace(/[\[\]]/g, "").trim() : "LOG",
		color: "#9aa0a6",
	};
}

// ---------------------------------------------------------------
// ডুপ্লিকেট-কোলাপ্স স্টেট (পরপর একই মেসেজ একাধিকবার আসলে "×N" দেখায়)
// ---------------------------------------------------------------
let lastEntry = null; // { key, count, renderedPrefixLen }

// ---------------------------------------------------------------
// প্রতিটা কমান্ড/ইভেন্ট লোড হওয়ার লাইন — প্রতিটা আলাদা লাইনে, নিজস্ব
// ক্রমিক নাম্বার সহ, একদম পরিষ্কার/প্রিমিয়াম ফরম্যাটে দেখানো হয়
// (Railway/Render এর মতো নন-TTY লগ ভিউয়ারেও, কোনো কিছুই লুকানো/
// সাইলেন্ট হয় না — যা চাওয়া হয়েছে ঠিক তাই)
// ---------------------------------------------------------------
const PROGRESS_PATTERNS = [
	{ re: /^Successfully installed module (.+)$/, label: "LOADED" },
	{ re: /^Installed whole package successfully for module (.+)$/, label: "PACKAGE" },
	{ re: /^Installed config successfully for module (.+)$/, label: "CONFIG" },
];
const loadCounts = {}; // প্রতিটা category-র জন্য আলাদা ক্রমিক গণনা

// Railway/Render এর মতো ওয়েব লগ-ভিউয়ার অনেক সময় প্রতি সেকেন্ডে অনেক
// আলাদা console.log() কল আসলে সেগুলোর কিছু অংশ "Skipped"/rate-limit করে
// লুকিয়ে ফেলে (নিচে "Hide Skipped" বাটন থাকে সেটাই এর প্রমাণ) — তাই আমরা
// একসাথে অনেকগুলো ছোট লাইন না ছেড়ে, কয়েকটা লাইনকে একসাথে জড়ো করে
// একটাই console.log() কলে (batch) পাঠাই। ফলে মোট লাইন সংখ্যা একই থাকে
// (প্রতিটা কমান্ডের নাম দেখা যাবে), কিন্তু আলাদা আলাদা লগ-ইভেন্ট অনেক
// কমে যায়, তাই হোস্টিং প্ল্যাটফর্ম সহজে বাদ দিতে পারে না।
const FLUSH_SIZE = 10;
let lineBuffer = [];

function flushBuffer() {
	if (lineBuffer.length === 0) return;
	console.log(lineBuffer.join("\n"));
	lineBuffer = [];
}

function clearLine() {
	if (isTTY) process.stdout.write("\r" + " ".repeat(Math.max(columns - 1, 20)) + "\r");
}

function finalizeDuplicateIfNeeded(newKey) {
	if (lastEntry && lastEntry.key !== newKey) {
		lastEntry = null;
	}
}

// ---------------------------------------------------------------
// একটা normal লাইন সুন্দরভাবে রেন্ডার + প্রিন্ট + ফাইলে সেভ
// ---------------------------------------------------------------
function renderLine(message, style) {
	const ts = chalk.gray(timeNow());
	const tag = chalk.bold.hex(style.color)(`${style.icon}${style.icon.trim() ? " " : ""}${style.label}`);
	const arrow = chalk.gray("›");
	return `${chalk.gray("[")}${ts}${chalk.gray("]")} ${tag} ${arrow} ${message}`;
}

function isDividerLine(message) {
	return /^[━\-=_]{5,}$/.test(String(message).trim());
}

function printDivider() {
	const width = Math.min(Math.max(columns - 2, 20), 60);
	console.log(chalk.hex("#33ffc9")("┈".repeat(width)));
	appendToFile("─".repeat(40));
}

function write(message, rawLevel, opts) {
	opts = opts || {};
	const isLoaderCall = !!opts.isLoader;
	message = message === undefined || message === null ? "" : String(message);

	// ---- WARN মেসেজ কনসোলে একদমই দেখাবে না (শুধু ফাইলে থাকবে, দরকার হলে) ----
	const normalizedLevel = rawLevel ? String(rawLevel).toLowerCase().replace(/[\[\]]/g, "").trim() : "";
	if (normalizedLevel === "warn" || normalizedLevel === "warning") {
		appendToFile(`[${rawLevel}] ${stripColor(message)}`);
		return;
	}

	// ---- ডিভাইডার লাইন অটো-স্টাইলিং ----
	if (isDividerLine(message)) {
		flushBuffer();
		lastEntry = null;
		printDivider();
		return;
	}

	// ---- প্রতিটা কমান্ড/ইভেন্ট/প্যাকেজ লোড লাইন — আলাদা আলাদা, ক্রমিক নাম্বার সহ ----
	const isPlainLevel = !rawLevel || String(rawLevel).toLowerCase() === "success" || String(rawLevel).toLowerCase() === "successful";
	if (isLoaderCall && isPlainLevel) {
		for (const p of PROGRESS_PATTERNS) {
			const m = message.match(p.re);
			if (m) {
				loadCounts[p.label] = (loadCounts[p.label] || 0) + 1;
				const n = loadCounts[p.label];
				const line =
					chalk.gray(`[${timeNow()}]`) + " " +
					chalk.bold.hex("#33ff8c")("✅ " + p.label) + " " +
					chalk.gray("›") + " " +
					chalk.gray(`#${String(n).padStart(3, "0")}`) + "  " +
					chalk.white(m[1]) + "  " +
					chalk.hex("#33ff8c")("সফলভাবে লোড হয়েছে ✔");
				appendToFile(`[LOADER:success] #${n} ${stripColor(message)}`);
				lineBuffer.push(line);
				if (lineBuffer.length >= FLUSH_SIZE) flushBuffer();
				lastEntry = null; // প্রতিটা লাইন আলাদা বলে ডুপ্লিকেট-কোলাপ্স এখানে দরকার নাই
				return;
			}
		}
	}
	flushBuffer(); // ভিন্ন ধরনের লাইন আসলে আগের ব্যাচ আগে দেখিয়ে দাও

	// ---- ডুপ্লিকেট-কোলাপ্স (একই মেসেজ+লেভেল পরপর একাধিকবার) ----
	const key = `${rawLevel || ""}|${message}`;
	if (lastEntry && lastEntry.key === key) {
		lastEntry.count += 1;
		appendToFile(`[${rawLevel || (isLoaderCall ? "LOADER" : "LOG")}] ${stripColor(message)} (×${lastEntry.count})`);
		if (isTTY) {
			clearLine();
			process.stdout.write(lastEntry.rendered + chalk.gray(`  (×${lastEntry.count})`));
		}
		return;
	}

	// ---- সাধারণ নতুন লাইন ----
	const style = resolveLevel(rawLevel) || (isLoaderCall ? LEVELS.loader : fallbackStyle(rawLevel));
	const rendered = renderLine(message, style);
	console.log(rendered);
	appendToFile(`[${rawLevel || (isLoaderCall ? "LOADER" : "LOG")}] ${stripColor(message)}`);

	lastEntry = { key, count: 1, rendered };
}

// =================================================================
//  Public API — পুরনোটার সাথে ১০০% সামঞ্জস্যপূর্ণ
// =================================================================
function logger(message, level) {
	write(message, level, { isLoader: false });
}

logger.loader = function (message, level) {
	write(message, level, { isLoader: true });
};

// ---- নতুন সুবিধাজনক shortcut গুলো (optional, নতুন কোডে ব্যবহার করা যাবে) ----
logger.info = (message) => write(message, "info");
logger.success = (message) => write(message, "success");
logger.warn = (message) => write(message, "warn");
logger.error = (message) => write(message, "error");
logger.system = (message) => write(message, "system");

// ---- ব্যাচে জমে থাকা লাইন থাকলে জোর করে এখনই দেখানোর জন্য (দরকার হলে) ----
logger.flush = flushBuffer;

// ---- সুন্দর বক্স-স্টাইল স্টার্টআপ ব্যানার ----
logger.banner = function (title, subtitle) {
	flushBuffer();
	const innerWidth = Math.max(String(title).length, subtitle ? String(subtitle).length : 0) + 4;
	const width = Math.min(Math.max(innerWidth, 30), Math.max(columns - 4, 30));
	const top = "╔" + "═".repeat(width) + "╗";
	const bottom = "╚" + "═".repeat(width) + "╝";
	const center = (text) => {
		const t = String(text);
		const pad = Math.max(width - t.length, 0);
		const left = Math.floor(pad / 2);
		const right = pad - left;
		return " ".repeat(left) + t + " ".repeat(right);
	};
	console.log(chalk.hex("#33ffc9")(top));
	console.log(chalk.hex("#33ffc9")("║") + chalk.bold.hex("#00e5ff")(center(title)) + chalk.hex("#33ffc9")("║"));
	if (subtitle) {
		console.log(chalk.hex("#33ffc9")("║") + chalk.hex("#9aa0a6")(center(subtitle)) + chalk.hex("#33ffc9")("║"));
	}
	console.log(chalk.hex("#33ffc9")(bottom));
	appendToFile(`[BANNER] ${title}${subtitle ? " — " + subtitle : ""}`);
};

// ---- সেকশন ডিভাইডার (ম্যানুয়ালি ব্যবহার করার জন্য) ----
logger.box = function (title) {
	flushBuffer();
	const width = Math.min(Math.max(columns - 2, 20), 60);
	const label = ` ${title} `;
	const sideLen = Math.max(Math.floor((width - label.length) / 2), 2);
	const line = "┈".repeat(sideLen) + label + "┈".repeat(width - sideLen - label.length);
	console.log(chalk.bold.hex("#33ffc9")(line));
	appendToFile(`── ${title} ──`);
};

logger.LOG_FILE = LOG_FILE;

// শেষরক্ষা: লুপ শেষ হওয়ার আগেই প্রসেস বন্ধ হয়ে গেলেও ব্যাচে জমে থাকা
// লাইনগুলো যেন হারিয়ে না যায়
process.on("exit", flushBuffer);

module.exports = logger;
