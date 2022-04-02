const Discord = require('discord.js')
const fetch = require('node-fetch')
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
const fs = require('fs');
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);
const { MessageEmbed } = require('discord.js')
var alert = require('data-storage-system')('./data/alerts');

var BTCprice = "null";
var ETHprice = "null";
var DOGEprice = "null";
var XLMprice = "null";

var client;

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

async function GetAlertPrice(coin, cb) {
	const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
	const data = await response.json();
	cb(data.market_data.current_price.usd);
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log('');
		console.log(`Ready! Logged in as ${client.user.tag}`);
		Prices();
		CheckAlerts(client);
		client.user.setActivity(`BTC = $${BTCprice}`, { type: 'WATCHING' });
		setInterval(() => {
			Prices();
		}, 60000);
		setInterval(() => {
			CheckAlerts(client);
		}, 10000)
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

//Handle alerts set buy users.
function CheckAlerts(client) {
	if (fs.existsSync(RootFolder + '/data/alerts/')) {
		async function SendPriceAlert(UserID, Coin, Price, AlertCurrentPrice) {
			const user = await client.users.fetch(UserID);
			const PriceAlertEmbed = new MessageEmbed()
				.setTitle(`${Coin} HAS REACHED OVER $${Price}`)
				.setColor('#F1C40F')
				.addFields(
					{ name: 'Current price', value: `$${AlertCurrentPrice}` }
				)
				.setTimestamp()
			user.send({ embeds: [PriceAlertEmbed] });
		}
		fs.readdir(RootFolder + '/data/alerts/', function (err, files) {
			if (err) {
				console.log("Could not list the directory.", err);
			}
			if (files.length) {
				files.forEach(function (file) {
					fs.readFile(RootFolder + `/data/alerts/${file}`, 'utf8', function (err, code) {
						if (err) return cb("error loading file" + err);
						try {
							code = JSON.parse(code);
							const UserAlerts = Object.keys(code);
							UserAlerts.forEach(function (UserAlert) {
								if(!UserAlert.includes('id')){
									if(!UserAlert.includes('-state')){
										GetAlertPrice(UserAlert.toLowerCase(), function (CurrentPrice) {
											const CoinPriceAlert = code[UserAlert]
											if (CurrentPrice > CoinPriceAlert) {
												alert.load(`${code.id}`, UserAlert + '-state', function (err, object) {
													if(err) throw err;
													if (object === '1') {
														//Alert already sent!
													} else {
														//Alert has not been sent
														alert.add(`${code.id}`, UserAlert + '-state', 1, function (err) {
															if(err) throw err;
															SendPriceAlert(code.id, UserAlert, CoinPriceAlert, CurrentPrice);
														});
													}
												});
											} else {
												alert.add(`${code.id}`, UserAlert + '-state', 0, function (err) {
													if(err) throw err;
												});
											}
										})
									}
								}
							});
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