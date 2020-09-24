# HCDecryptor-tg
Telegram bot for decrypt HTTP Custom configurations on Telegram

# Install instructions
- Download Node.JS [Download Here](https://nodejs.org/en/download/ "Node.JS Download")
- Once installed Node.JS, execute "install-dep" .sh/.bat script depending on your platform, or...
- ... execute `npm update --save` in the same folder as the script.

# Usage
This script supports arguments to avoid editing the file to insert your Telegram Bot token.
Execute by doing:

`node index.js -bt (your bot token here)`

And the bot will use the token stored in the argument.

You can also customize the "storage" folder, (where the files from Telegram will be downloaded) using the -d argument

`node index.js -bt (your bot token here) -d (physical path where the incoming files should be stored)`

The bot automatically deletes every incoming files at the end of each decryption call once the final data is returned.

If for some reason you want to conserve the files, you can pass the -c argument and the bot will not delete every downloaded file. Example:

`node index.js -bt (your token) -d (temp dir path) -c`

# Argument summary

```
-bt, --botToken    Start the bot with the desired token
-d, --dir          Set up an custom temporary directory path where all files from Telegram should be downloaded
-c, --conserve     Conserve files and not delete them after each requested task is done
```