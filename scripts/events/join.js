module.exports.config = {
    name: "join",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "CatalizCS | Fixed by Raj",
    description: "Notify bot or group member with random gif/photo/video",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const path1 = join(__dirname, "cache", "joinGif", "randomgif");
    if (!existsSync(path1)) mkdirSync(path1, { recursive: true });

    return;
}

module.exports.run = async function ({ api, event }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    const fs = require("fs");

    // যদি বটকে অ্যাড করা হয়
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || ""}`, threadID, api.getCurrentUserID());
        return api.sendMessage("", event.threadID, () =>
            api.sendMessage({
                body: `আসসালামুআলাইকুম🥀
😈🥀😈
____________________________________
🤖 BOT CONNECTED!!! 
adding in the group chat successfully!!!
🙈 হায় বাবুরা শয়তানি করার জন্য এড দিছত তাই না 🐒
____________________________________

যেকোনো কমান্ড দেখতে .help ব্যবহার করুন
BOT ADMIN: Raj Ahmed 

____________________________________
যেকোনো অভিযোগ অথবা হেল্প এর জন্য আমার বস রাজ কে নক করতে পারেন 
👉 Facebook: https://www.facebook.com/profile.php?id=61574869774986
`,
                attachment: fs.createReadStream(__dirname + "/JOY/mim.png")
            }, threadID)
        );
    }

    // যদি অন্য কেউ অ্যাড হয়
    try {
        const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
        let { threadName, participantIDs } = await api.getThreadInfo(threadID);

        const threadData = global.data.threadData.get(parseInt(threadID)) || {};
        const path = join(__dirname, "cache", "joinGif");
        const pathGif = join(path, `${threadID}.gif`);

        let mentions = [], nameArray = [], memLength = [], i = 0;

        for (let p of event.logMessageData.addedParticipants) {
            nameArray.push(p.fullName);
            mentions.push({ tag: p.fullName, id: p.userFbId });
            memLength.push(participantIDs.length - i++);
        }
        memLength.sort((a, b) => a - b);

        let msg = (typeof threadData.customJoin == "undefined") ?
            `╔════•|      ✿      |•════╗
 💐আ্ঁস্ঁসা্ঁলা্ঁমু্ঁ💚আ্ঁলা্ঁই্ঁকু্ঁম্ঁ💐
╚════•|      ✿      |•════╝

✨🆆🅴🅻🅻 🅲🅾🅼🅴✨

❥𝐍𝐄𝐖~🇲‌🇪‌🇲‌🇧‌🇪‌🇷‌~
[   {name} ]

༄✺আ্ঁপ্ঁনা্ঁকে্ঁ আ্ঁমা্ঁদে্ঁর্ঁ✺࿐

{threadName}

🥰🖤🌸—এ্ঁর্ঁ প্ঁক্ষ্ঁ🍀থে্ঁকে্ঁ🍀—🌸🥀
🥀_ভা্ঁলো্ঁবা্ঁসা্ঁ_অ্ঁভি্ঁরা্ঁম্ঁ_🥀

আপনি এই গ্রুপের {soThanhVien} নং মেম্বার

╔╦══•  •✠•❀•✠•  •══╦╗
♥ 𝐁𝐎𝐓'𝐬 𝐎𝐖𝐍𝐄𝐑 ♥
♥ 𝐑𝐀𝐉 𝐀𝐇𝐌𝐄𝐃 ♥
╚╩══•  •✠•❀•✠•  •══╩` : threadData.customJoin;

        msg = msg
            .replace(/\{name}/g, nameArray.join(', '))
            .replace(/\{soThanhVien}/g, memLength.join(', '))
            .replace(/\{threadName}/g, threadName);

        const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));

        let formPush;
        if (existsSync(pathGif)) {
            formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
        } else if (randomPath.length > 0) {
            const pathRandom = join(__dirname, "cache", "joinGif", "randomgif",
                randomPath[Math.floor(Math.random() * randomPath.length)]);
            formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
        } else {
            formPush = { body: msg, mentions };
        }

        return api.sendMessage(formPush, threadID);
    } catch (e) {
        console.log(e);
    }
			}
