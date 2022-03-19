## Wut is this?
Source of a cool bot that I managed to made. 
This bot's status cycles trough the price of Bitcoin, Ethereum, Dogecoin and Stellar.

## Commands
This bot uses application commands!
Users can Buy and Sell over 1000 coins with commands:
```
/buy [amount] [coin]
/sell [amount] [coin]
```

Users can also send USD to other users with command:
```
/pay [amount] [user]
```

Users can even "mine" USD by answering simple math questions with command:
```
/mine
```
To answer the given question just define the `[answer]` value

## Installation

1.  Download the latest [release](https://github.com/JAAKKQ/DiscordBot/releases)
2.  Extract it with WinRAR, 7zip, WinZip...
3.  Go to the [Discord Developer Portal](https://discord.com/developers/applications) and grab your bot token
4.  Run the index.html: `node index.js` 
5.  The wizard will then ask you if you want to set a new bot token
6.  Type `y` and hit <kbd>enter</kbd>
7.  Paste your token and hit <kbd>enter</kbd>
8.  Then paste your bot's id and hit <kbd>enter</kbd>
9.  The bot should start if there were no errors

You should never write your bot's token or id directly to the `config.json` file, always use the wizard to change them!
