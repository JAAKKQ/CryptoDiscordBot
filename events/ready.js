const Discord = require('discord.js')
const fetch = require('node-fetch')
const isEmptyObject = (obj) => Object.keys(obj).length === 0;

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

//Handle alerts set buy users.
function HandleAlerts() {
	fs.readdir(RootFolder + '/data/member/', function (err, files) {
		if (err) {
			console.log("Could not list the directory.", err);
		}
		if (files.length) {
			files.forEach(function (file, index) {
				fs.readFile(RootFolder + `/data/member/${file}`, 'utf8', function (err, code) {
					if (err) return cb("error loading file" + err);
					try {
						//Code for each user
					}
					catch (e) {
						console.log("Error parsing " + f + ": " + e);
					}
				});
			});
		} else {
			console.log('Data directory is empty!');
		}
	});
}

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
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