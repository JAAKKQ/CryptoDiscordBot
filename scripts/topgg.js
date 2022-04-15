const express = require('express')
const Topgg = require('@top-gg/sdk')
const { dirname } = require('path');
const RootFolder = dirname(require.main.filename);

module.exports = function (dir) {
  return {
    dir: dir,

    init: function () {
      console.log('Starting Top.gg server...');
      const { TopGGkey } = require(RootFolder + '/config.json');
      const webhook = new Topgg.Webhook(TopGGkey) // add your Top.gg webhook authorization (not bot token)
      const app = express() // Your express app
      bindWeb();
      app.listen(3000) // your port
    }
  }
};

function bindWeb() {
  app.post('/dblwebhook', webhook.listener(vote => {
    // vote is your vote object
    console.log(vote.user) // 221221226561929217
  })) // attach the middleware
}