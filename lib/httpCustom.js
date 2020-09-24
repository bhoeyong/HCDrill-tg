/*
* HTTP Custom module
* Yeah, this covers basically all HTTP Custom encryption methods and etc
*/
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const fs = require('fs');
const xorValues = ['。', '〃', '〄', '々', '〆', '〇', '〈', '〉', '《', '》', '「', '」', '『', '』', '【', '】', '〒', '〓', '〔', '〕'];
function xorDeobfs(file) {
    //xor deobfs
    var deobfs_val = "";
    for(a = 0, b = 0; a < file.length; a++, b++) {
        if(b >= xorValues.length) {b = 0}
        deobfs_val += String.fromCharCode(file.charCodeAt(a) ^ xorValues[b].charCodeAt(0));
    }
    return deobfs_val;
}
function sha1crypt(data) {
    var outp1 = crypto.createHash("sha1");
    outp1.update(data);
    outp1=outp1.digest('hex');
    return outp1.substring(0, outp1.length-8);
}
function aesDecrypt(data, key) {
    //aes but with raw data
    var aesoutp1 = CryptoJS.AES.decrypt(data, CryptoJS.enc.Hex.parse(key), {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return aesoutp1.toString(CryptoJS.enc.Utf8);
}
function aesDecrypt2(data, key) {
    //aes but with base64 encoded data
    var aesoutp2 = CryptoJS.AES.decrypt(Buffer.from(data).toString("base64"), CryptoJS.enc.Hex.parse(key), {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return aesoutp2.toString(CryptoJS.enc.Utf8);
}
function parseDecoded(data) {
    //only json, so, we parse this json inside a json later in the main bot script or any place where this is used
    var st1 = data.split("[splitConfig]");
    var outp2 = {};
    outp2["payload"] = st1[0];
    outp2["proxyURL"] = st1[1];
    outp2["blockedRoot"] = st1[2];
    outp2["lockPayloadAndServers"] = st1[3];
    outp2["expireDate"] = st1[4];
    outp2["containsNotes"] = st1[5];
    outp2["note1"] = st1[6];
    outp2["sshAddr"] = st1[7];
    outp2["mobileData"] = st1[8];
    outp2["unlockProxy"] = st1[9];
    outp2["openVPNConfig"] = st1[10];
    outp2["VPNAddr"] = st1[11];
    outp2["sslsni"] = st1[12];
    outp2["connectSSH"] = st1[13];
    outp2["udpgwPort"] = st1[14];
    outp2["lockPayload"] = st1[15];
    outp2["hwidEnabled"] = st1[16];
    outp2["hwidValue"] = st1[17];
    outp2["note2"] = st1[18];
    outp2["unlockUserAndPassword"] = st1[19];
    outp2["sslPayloadMode"] = st1[20];
    outp2["passwordProtected"] = st1[21];
    outp2["passwordValue"] = st1[22];
    outp2["raw"] = data;
    return JSON.stringify(outp2);
}
function decryptFile(fileContent) {
    var keyFile;
    var complete = false;
    var completev2 = false;
    var response = {};
    response["content"] = "";
    response["error"] = "";
    try {
        keyFile = JSON.parse(fs.readFileSync("lib/keyFile.json").toString())["httpCustom"];
    } catch(error) {
        response["error"] = error;
        return JSON.stringify(response);
    }
    //decrypting stage
    for(c = 0; c < keyFile.length; c++) {
        try {
            response["content"] = aesDecrypt(xorDeobfs(fileContent.toString("utf-8")), sha1crypt(keyFile[c]));
            if(response["content"].length > 1) {
                complete = true;
                break;
            } else {
                throw "False UTF-8";
            }
        } catch(error) {}
    }
    if(!complete) {
        for(c = 0; c < keyFile.length; c++) {
            try {
                response["content"] = aesDecrypt2(fileContent, sha1crypt(keyFile[c]));
                if(response["content"].length > 1) {
                    completev2 = true;
                    break;
                } else {
                    throw "False UTF-8";
                }
            } catch(error) {}
        }
        if(!completev2) {
            //no decryption ways or something
            response["error"] = 1;
        }
    }
    //parsing the decoded data...
    response["content"] = parseDecoded(response["content"]);
    return JSON.stringify(response);
}
module.exports.decrypt = function(file) { return decryptFile(file); };