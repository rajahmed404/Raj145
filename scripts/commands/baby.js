const axios = require("axios");

const BOT_REPLIES = [
  "আমি এখন রাজ বস এর সাথে বিজি আছি",
  "তুমি মেয়ে হলে রাজ বসের চিপায় যাও বাবু?",
  "রাজ বসের পক্ষ থেকে তোমার অলিতে বলেছে চুম্মা ",
  "আমাকে না ডেকে আমার বসকে মিস কল দেও 01313186145-😍💋💝",
  "আমাকে ডাকিস না আমি টখন রাজ বসের সাথে বিজি আছি "আমাকে না ডেকে আমার বস রাজকে ডাকেন! link:https://www.facebook.com/share/1KnPGXmL2B/",
  "জান চিপায় আসো প্রেমের টিকা দিমু 😘😘,
  "আমাকে না ডেকে আমার বস কে একটা gf দে  🤖?",
  "আগেই বলছি গাড়ি খেয়ে মত চালাস না 🤣 🤖",
  "রাজ বসও তোমাকে অনেক ভালোবাসে~~~"
];

const TRIGGERS = ["bot", "বট", "bby"];

module.exports.config = {
  name: "bot",
  version: "3.3.0",
  permission: 0,
  credits: "JOY",
  description: "Trigger bot + API reply + reply-to-bot messages",
  prefix: false,
  category: "chat",
  usages: "[bot/bট/bby / question]",
  cooldowns: 2,
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  try {
    const { threadID, messageID, body } = event;
    const text = body.trim();

    const API_CONFIG_URL = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json";
    const configRes = await axios.get(API_CONFIG_URL);
    const API_BASE = configRes.data.api;

    const res = await axios.get(`${API_BASE}/sim?text=${encodeURIComponent(text)}`);
    const answer = res.data.answer || "😶 Bot কিছু বলতে পারলো না";

    const sentMsg = await api.sendMessage(answer, threadID, messageID);
    global.client.handleReply.push({
      type: "reply",
      name: this.config.name,
      author: event.senderID,
      messageID: sentMsg.messageID
    });
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ API error: " + e.message, event.threadID, event.messageID);
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const text = body.trim();
  const lowerText = text.toLowerCase();

  try {
    
    if (TRIGGERS.includes(lowerText)) {
      const randomReply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      const sentMsg = await api.sendMessage(randomReply, threadID, messageID);
      global.client.handleReply.push({
        type: "reply",
        name: this.config.name,
        author: event.senderID,
        messageID: sentMsg.messageID
      });
      return;
    }

    
    const API_CONFIG_URL = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json";
    const configRes = await axios.get(API_CONFIG_URL);
    const API_BASE = configRes.data.api;

    const res = await axios.get(`${API_BASE}/sim?text=${encodeURIComponent(text)}`);
    const answer = res.data.answer || "😶 Bot কিছু বলতে পারলো না";

    const sentMsg = await api.sendMessage(answer, threadID, messageID);
    global.client.handleReply.push({
      type: "reply",
      name: this.config.name,
      author: event.senderID,
      messageID: sentMsg.messageID
    });

  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ API error: " + e.message, threadID, messageID);
  }
};
