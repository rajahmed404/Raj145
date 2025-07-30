const axios = require("axios");

const API_CONFIG_URL = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json";

async function getApiUrl() {
  try {
    const res = await axios.get(API_CONFIG_URL);
    return res.data.api;
  } catch (e) {
    console.error("❌ Failed to fetch API URL from GitHub:", e.message);
    return null;
  }
}

module.exports.config = {
  name: "teach",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "Joy Ahmed",
  description: "Teach Joy AI with new replies (using API)",
  category: "fun",
  usages: "teach <question> - <answer>",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const input = args.join(" ").trim();

  if (!input.includes(" - ")) {
    return api.sendMessage(
      "❌ সঠিক ফরম্যাট ব্যবহার করুন:\nteach <question> - <answer>\nউদাহরণ: teach তুমি কে? - আমি জয় বট 🤖",
      event.threadID,
      event.messageID
    );
  }

  const [question, answer] = input.split(" - ").map(str => str.trim());

  if (!question || !answer) {
    return api.sendMessage("❌ প্রশ্ন বা উত্তর ফাঁকা রাখা যাবে না!", event.threadID, event.messageID);
  }

  const apiUrl = await getApiUrl();
  if (!apiUrl) {
    return api.sendMessage("❌ API URL পাওয়া যায়নি। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }

  try {
    await axios.get(`${apiUrl}/sim?type=teach&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}&senderID=${event.senderID}`);
    return api.sendMessage(
      `╭╼|━━━━━━━━━━━━━━|╾╮\n✅ শেখানো হয়েছে!\n❓ প্রশ্ন: ${question}\n💬 উত্তর: ${answer}\n╰╼|━━━━━━━━━━━━━━|╾╯`,
      event.threadID,
      event.messageID
    );
  } catch (err) {
    console.error("❌ Teach API error:", err.message);
    return api.sendMessage("❌ শেখাতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
