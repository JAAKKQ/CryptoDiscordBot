const Discord = require('discord.js')
const fetch = require('node-fetch')
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
const fs = require('fs');
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
var alert = require('data-storage-system')('./data/alerts');

var BTCprice = "null";
var ETHprice = "null";
var DOGEprice = "null";
var XLMprice = "null";

async function getJson(url, path) {
	let response = await fetch(url);
	let data = await response.json()
	let Price = "";
	let Error = "Error";
	if (!isEmptyObject(data)) {
		Price = data[path].usd || 0 // Default to zero
		return Price;
	}
	else
		return Error;
}

async function Prices() {
	BTCprice = await getJson("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", "bitcoin")
	ETHprice = await getJson("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd", "ethereum")
	DOGEprice = await getJson("https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd", "dogecoin")
	XLMprice = await getJson("https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd", "stellar")
}

async function GetAlertPrice(coin, cb){
	const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
	const data = await response.json();
	cb(data.market_data.current_price.usd);
}

//Handle alerts set buy users.
function CheckAlerts() {
	if (fs.existsSync(RootFolder + '/data/alerts/')) {
		fs.readdir(RootFolder + '/data/alerts/', function (err, files) {
			if (err) {
				console.log("Could not list the directory.", err);
			}
			if (files.length) {
				files.forEach(function (file, index) {
					fs.readFile(RootFolder + `/data/alerts/${file}`, 'utf8', function (err, code) {
						if (err) return cb("error loading file" + err);
						try {
							code = JSON.parse(code);
							const first = Object.keys(code)[1];
							GetAlertPrice(first.toLowerCase(), function (CurrentPrice) {
								const Coin = first
								const CoinPriceAlert = code[first]
								if(CurrentPrice >= CoinPriceAlert){
									console.log(CoinPriceAlert);
								}else{
									console.log('' + CoinPriceAlert);
								}
								console.log(CoinPriceAlert); //Sinä jäit tähän!
							})
						}
						catch (e) {
							console.log("Error parsing " + f + ": " + e);
						}
					});
				});
			} else {
				console.log('No alerts to check!');
			}
		});
	} else {
		//Create path
		console.log('Creating alerts data directory...')
		fs.mkdirSync(RootFolder + '/data/alerts/', { recursive: true });
		CheckAlerts();
	}
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('');
		console.log(`Ready! Logged in as ${client.user.tag}`);
		Prices();
		client.user.setActivity(`BTC = $${BTCprice}`, { type: 'WATCHING' });
		setInterval(() => {
			Prices();
		}, 60000);
		setInterval(() => {
			setTimeout(function () {
				client.user.setActivity(`BTC = $${BTCprice}`, { type: 'WATCHING' });
			}, 5000);
			setTimeout(function () {
				client.user.setActivity(`ETH = $${ETHprice}`, { type: 'WATCHING' });
			}, 10000);
			setTimeout(function () {
				client.user.setActivity(`DOGE = $${DOGEprice}`, { type: 'WATCHING' });
			}, 15000);
			setTimeout(function () {
				client.user.setActivity(`XLM = $${XLMprice}`, { type: 'WATCHING' });
			}, 20000);
		}, 25000);
	},
};