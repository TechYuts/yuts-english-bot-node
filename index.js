var SlackBot = require("slackbots");
var randomWords = require('random-words');
var alc = require("./alc.js")
var channel = "hubot-dev";
var map = {}; 
 
var token;

if (process.env.token == null){
    var config = require('./config/development.json')
    token = config.yutsbot.token;
}
else{
    token = process.env.token;
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
    switch(message.text) {
        case "plzq":
            sendWord(message.user);
            break;
        case "plza":
            sendMeaning(message.user);
            break;
        case "ping":
            bot.postMessage(message.channel, "PONG!");
            break;
        default:
            return;
    }
}

function sendWord(user){
    if (map[user]) {
        bot.postMessageToChannel(channel, "<@" + user + "> さんの今日の単語はすでに登録されています「" + map[user] + "」です。");
        return;
    }
    map[user] = randomWords();
    bot.postMessageToChannel(channel, "<@" + user + "> さんの今日の単語は「" + map[user] + "」です。");
    return;
}

function sendMeaning(user) {
    if(!map[user]){
        bot.postMessageToChannel(channel, "まだ今日の単語が登録されていません");
        return;
    }
    var result = alc(map[user], bot);
    delete map[user];
}
