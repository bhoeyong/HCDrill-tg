const apiTelegram = require('node-telegram-bot-api');
const botToken = "insert_bot_token_here";
const bot = new apiTelegram(botToken, {polling: true});
bot.on("message", function(message) {
    if(message.from.is_bot) { return; } //ignoring messages from bots
    if(!message.document) { return; } //ignoring any other messages that aren't a document or raw file
    //[15/09] - start writing this section once i finish implementing all js files in lib folder
});
bot.on('polling_error', function(error) {
    console.log("[ERROR] - Polling error:\r\n" + error);
});
console.log("[INFO] - Bot started!");