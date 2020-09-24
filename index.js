/*
* HCDrill - Telegram version
* Coded by PANCHO7532 - P7COMunications LLC
* Copyright (c) HCTools Group - 2020
*
* This program comes with a LICENSE file that you must read before redistributing or modifying this code.
*/
const fs = require('fs');
const path = require('path');
const util = require("util");
const syncRequest = require('sync-request');
var botToken = "your_bot_token_here";
const downloadDirectory = "storage/"; //for store incoming files
var showHelp = false;
//splash
console.log("HCDrill v1.0\r\nCopyright (c) HCTools Group - 2020\r\nCoded by P7COMunications LLC");
for(c = 0; c < process.argv.length; c++) {
    switch(process.argv[c]) {
        case "--botToken":
        case "-bt":
            botToken = process.argv[c+1];
            break;
        case "--help":
        case "-h":
            showHelp = true;
            break;
    }
}
if(showHelp) {
    var helpContent = [
        "Usage: node script.js [--args -a...]",
        "",
        "--botToken, -bt\t\tSet your bot token",
        "--help, -h\t\tDisplay this help text"
    ];
    for(c=0; c < helpContent.length; c++) {
        console.log(helpContent[c]);
    }
    process.exit();
}
const apiTelegram = require('node-telegram-bot-api');
const bot = new apiTelegram(botToken, {polling: true});
function fileDownload(url) {
    //this will return the filename of the file saved
    var request = syncRequest("GET", url);
    if(request["statusCode"] != 200) {
        return -1;
    }
    if(!request["headers"]["content-length"]) {
        return -1;
    }
    if(request["headers"]["content-length"] > 5000000) {
        //limit cap to 5MB in server response
        return -2;
    }
    fs.writeFileSync(downloadDirectory + path.parse(url)["base"], request["body"]);
    return path.parse(url)["base"];
}
bot.on("message", function(message) {
    if(message.from.is_bot) { return; } //ignoring messages from bots
    if(!message.document) { return; } //ignoring any other messages that aren't a document or raw file
    if(!message.caption) {
        bot.sendMessage(message.chat.id, "You need to specify an caption before sending the document, ex:\r\n/hc_decrypt - Decrypt this file using HTTP Custom methods", {reply_to_message_id: message.message_id});
        return;
    }
    //[15/09] - start writing this section once i finish implementing all js files in lib folder
    if(message.caption.substring(0, 11) == "/hc_decrypt") {
        bot.getFile(message.document["file_id"]).then(function(result){
            var localFilePath = fileDownload("https://api.telegram.org/file/bot" + botToken + "/" + result["file_path"]);
            if(localFilePath == -1) {
                bot.sendMessage(message.chat.id, "Invalid file or metadata info.", {reply_to_message_id: message.message_id});
                return;
            } else if(localFilePath == -2) {
                bot.sendMessage(message.chat.id, "The file is too heavy!", {reply_to_message_id: message.message_id});
                return
            }
            var localApiResult = JSON.parse(require("./lib/httpCustom").decrypt(fs.readFileSync(downloadDirectory + localFilePath)));
            if(localApiResult["error"] == 1) {
                bot.sendMessage(message.chat.id, "Decryption failed, incompatible encryption method or algorithm.");
                return;
            }
            var decryptedContent = JSON.parse(localApiResult["content"]);
            var response = "";
            response+="(Payload)-> " + decryptedContent["payload"];
            response+="\r\n(Proxy URL)-> " + decryptedContent["proxyURL"];
            response+="\r\n(Config blocked for root devices?)-> " + decryptedContent["blockedRoot"];
            response+="\r\n(Lock Payload and Servers?)-> " + decryptedContent["lockPayloadAndServers"];
            response+="\r\n(Expiration Date)-> " + decryptedContent["expireDate"];
            response+="\r\n(File has notes?)-> " + decryptedContent["containsNotes"];
            response+="\r\n(Note field 1)-> " + decryptedContent["note1"];
            response+="\r\n(SSH Address)-> " + decryptedContent["sshAddr"];
            response+="\r\n(Config blocked for mobile data only?)-> " + decryptedContent["mobileData"];
            response+="\r\n(Unlock Proxy field?)-> " + decryptedContent["unlockProxy"];
            response+="\r\n(OpenVPN configuration file)-> " + decryptedContent["openVPNConfig"];
            response+="\r\n(VPN address)-> " + decryptedContent["VPNAddr"];
            response+="\r\n(SSL/SNI value)-> " + decryptedContent["sslsni"];
            response+="\r\n(Connect using SSH?)-> " + decryptedContent["connectSSH"];
            response+="\r\n(UDPGW Port)-> " + decryptedContent["udpgwPort"];
            response+="\r\n(Lock Payload only?)-> " + decryptedContent["lockPayload"];
            response+="\r\n(File locked with HWID?)-> " + decryptedContent["hwidEnabled"];
            response+="\r\n(HWID value)-> " + decryptedContent["hwidValue"];
            response+="\r\n(Note field 2)-> " + decryptedContent["note2"];
            response+="\r\n(Unlock User and Password fields?)-> " + decryptedContent["unlockUserAndPassword"];
            response+="\r\n(SSL + Payload mode?)-> " + decryptedContent["sslPayloadMode"];
            response+="\r\n(Password protected file?)-> " + decryptedContent["passwordProtected"];
            response+="\r\n(Password value)-> " + decryptedContent["passwordValue"]
            if(message.caption.indexOf("raw") != -1) {
                response+="\r\n(RAW Value)-> " + decryptedContent["raw"];
            }
            bot.sendMessage(message.chat.id, response, {reply_to_message_id: message.message_id});
            //deleting file so we dont acumulate a lot of files on the download directory
            fs.unlinkSync(downloadDirectory + localFilePath);
        });
    }
});
bot.on('polling_error', function(error) {
    console.log("[ERROR] - Polling error:\r\n" + error);
});
console.log("[INFO] - Bot started!");