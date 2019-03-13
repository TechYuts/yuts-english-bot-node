var SlackBot = require("slackbots");
var randomWords = require('random-words');
var alc = require("./alc.js")
var channel;
var map = {}; 
 
var token;

if (process.env.token == null){
    var config = require('./config/development.json')
    token = config.yutsbot.token;
    channel = config.yutsbot.channel;
}
else{
    token = process.env.token;
    channel = process.env.channel;
}

var bot = new SlackBot({
   token: token,
   name: "yutsbot"
});

bot.on("start", function() {
    console.log("Hello world!");
});

bot.on("message", function(data) {
    if (data.type !== "message") {
        return;
    }
    
    handleMessage(data);
});

function handleMessage(message) {
    switch(true) {
        case message.text.includes("plzq"):
            sendWord(message.user);
            break;
        case message.text.includes("plza"):
            sendMeaning(message.user);
            break;
        case message.text == "ping":
            bot.postMessage(message.channel, "PONG!", {as_user: true});
            break;
        default:
            return;
    }
}

function sendWord(user){
    if (map[user]) {
        bot.postMessageToChannel(channel, "<@" + user + "> さんの今日の単語はすでに登録されています「" + map[user] + "」です。", {as_user: true});
        return;
    }
    map[user] = randomWords();
    bot.postMessageToChannel(channel, "<@" + user + "> さんの今日の単語は「" + map[user] + "」です。", {as_user: true});
    return;
}

function sendMeaning(user) {
    if(!map[user]){
        bot.postMessageToChannel(channel, "まだ今日の単語が登録されていません", {as_user: true});
        return;
    }
    alc(map[user], bot).then(function (result) {
        bot.postMessageToChannel(channel, result, {as_user: true});
    });
    delete map[user];
}
