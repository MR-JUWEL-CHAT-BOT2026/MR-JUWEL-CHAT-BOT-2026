module.exports.config = {
	name: "cache",
	version: "3.0.0",
	hasPermssion: 2,
	credits: "乛 M𝆠፝֟R ཐི༏ཋྀ JU𝆠፝֟W𝆠፝֟ELꜛཐི༏ཋྀ࿐",
	description: "Advanced Cache Manager",
	commandCategory: "Admin System",
	usages: "cache / cache start <text> / cache ext <ext>",
	cooldowns: 5
};

const fs = require("fs-extra");
const path = require("path");

module.exports.handleReply = async function ({ api, event, handleReply }) {
	try {

		if (event.senderID != handleReply.author) return;

		const cachePath = path.join(__dirname, "cache");

		if (!event.body) {
			return api.sendMessage(
				"⚠️ Please reply with file numbers.",
				event.threadID,
				event.messageID
			);
		}

		const nums = event.body
			.split(/\s+/)
			.map(n => parseInt(n))
			.filter(n => !isNaN(n));

		if (nums.length == 0) {
			return api.sendMessage(
				"❌ Invalid reply format.",
				event.threadID,
				event.messageID
			);
		}

		let success = "";
		let failed = "";
		let deleted = 0;

		for (const num of nums) {

			const target = handleReply.files[num - 1];

			if (!target) continue;

			const targetPath = path.join(cachePath, target);

			if (!fs.existsSync(targetPath)) continue;

			try {

				const stats = fs.statSync(targetPath);

				if (stats.isDirectory()) {

					fs.removeSync(targetPath);

					success += `🗂️ ${target}\n`;
				}

				else if (stats.isFile()) {

					fs.unlinkSync(targetPath);

					success += `📄 ${target}\n`;
				}

				deleted++;

			} catch (e) {

				failed += `❌ ${target}\n`;
			}
		}

		api.sendMessage(
`╭━━━〔 🧹 CACHE CLEANER 〕━━━╮

✅ Successfully Deleted: ${deleted}

${success ? `╭─❍ Deleted Items ❍─╮
${success}
╰────────────────╯` : ""}

${failed ? `╭─❍ Failed Items ❍─╮
${failed}
╰────────────────╯` : ""}

╰━━━━━━━━━━━━━━━━━━╯`,
			event.threadID,
			event.messageID
		);

	} catch (e) {

		console.log(e);

		api.sendMessage(
			"❌ Error while deleting cache files.",
			event.threadID,
			event.messageID
		);
	}
};

module.exports.run = async function ({ api, event, args }) {

	try {

		const permission = [
			"100071528325738"
		];

		if (!permission.includes(event.senderID)) {

			return api.sendMessage(
				"❌ You are not authorized to use this command.",
				event.threadID,
				event.messageID
			);
		}

		const cachePath = path.join(__dirname, "cache");

		if (!fs.existsSync(cachePath)) {
			fs.mkdirSync(cachePath, {
				recursive: true
			});
		}

		let files = fs.readdirSync(cachePath);

		// HELP

		if (args[0] == "help") {

			const help = `
╭━━━〔 📦 CACHE HELP MENU 〕━━━╮

📌 cache
➜ Show all cache files

📌 cache start <name>
➜ Show files starting with text

📌 cache ext <ext>
➜ Show files by extension

📌 cache <name>
➜ Search files by name

📌 Reply with numbers
➜ Delete selected files

━━━━━━━━━━━━━━━━━━

📝 Example:
cache ext mp4
cache start video
cache png

╰━━━━━━━━━━━━━━━━━━╯`;

			return api.sendMessage(
				help,
				event.threadID,
				event.messageID
			);
		}

		let key = "";

		// START FILTER

		if (args[0] == "start" && args[1]) {

			const word = args.slice(1).join(" ").toLowerCase();

			files = files.filter(file =>
				file.toLowerCase().startsWith(word)
			);

			key = `📂 Files Starting With: ${word}`;
		}

		// EXTENSION FILTER

		else if (args[0] == "ext" && args[1]) {

			const ext = args[1].replace(".", "").toLowerCase();

			files = files.filter(file =>
				file.toLowerCase().endsWith("." + ext)
			);

			key = `📄 Files Extension: .${ext}`;
		}

		// SEARCH FILTER

		else if (args[0]) {

			const word = args.join(" ").toLowerCase();

			files = files.filter(file =>
				file.toLowerCase().includes(word)
			);

			key = `🔍 Search Result: ${word}`;
		}

		// ALL FILES

		else {

			key = "📦 All Cache Files";
		}

		if (files.length == 0) {

			return api.sendMessage(
				"❌ No files found in cache folder.",
				event.threadID,
				event.messageID
			);
		}

		let msg = "";
		let i = 1;

		for (const file of files) {

			const filePath = path.join(cachePath, file);

			const stats = fs.statSync(filePath);

			const type = stats.isDirectory()
				? "🗂️ Folder"
				: "📄 File";

			const size = stats.isFile()
				? (stats.size / 1024).toFixed(2) + " KB"
				: "--";

			msg += ` ${i++}. ${type}
 🏷️ Name: ${file}
 📦 Size: ${size}

`;
		}

		api.sendMessage(
`╭━━━〔 🧹 CACHE MANAGER 〕━━━╮

${key}
📊 Total Items: ${files.length}

━━━━━━━━━━━━━━━━━━

${msg}
━━━━━━━━━━━━━━━━━━

💬 Reply with file numbers
📝 Example: 1 2 5

╰━━━━━━━━━━━━━━━━━━╯`,
			event.threadID,
			(error, info) => {

				global.client.handleReply.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					files
				});
			},
			event.messageID
		);

	} catch (e) {

		console.log(e);

		api.sendMessage(
			"❌ Cache command failed.",
			event.threadID,
			event.messageID
		);
	}
};
