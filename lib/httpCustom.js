/*
* HTTP Custom module
* Yeah, this covers basically all HTTP Custom encryption methods and etc
*/
const CryptoJS = require('crypto-js');
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
function decryptFile(fileContent, customMethod, customKey) {
    var keyFile;
    var response = {};
    response["content"] = "";
    response["error"] = "";
    try {
        keyFile = JSON.parse(fs.readFileSync("./keyFile.json").toString())["httpCustom"];
    } catch(error) {
        response["error"] = error;
        return JSON.stringify(response);
    }
    //decrypting stage
    if(customKey) {
        try {
            switch(customMethod) {
                case 1:
                    //do something
                    response["content"] = aesDecrypt(xorDeobfs(fileContent.toString()), sha1crypt(customKey));
                    if(response["content"].length < 2) {
                        throw "False UTF-8"
                    }
                    break;
                case 2:
                    //do another thing
                    response["content"] = aesDecrypt2(fileContent, sha1crypt(customKey));
                    if(response["content"].length < 2) {
                        throw "False UTF-8"
                    }
                    break;
                default:
                    //do another thing too
                    var complete = false;
                    try {
                        //eeh
                    } catch(error2) {
                        
                    }
                    break;
            }
        } catch(error) {
            response["error"] = error;
            return JSON.stringify(response);
        }
    }
    try {
        switch(method) {
            case 1:
                //do something
                if(key) {
                    response["payload"] = aesDecrypt(xorDeobfs(fileContent.toString()), key)
                }
                break;
            case 2:
                //do another thing
                break;
            default:
                //do another thing too
                break;
        }
    } catch(error) {

    }
}