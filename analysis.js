const Promise = require("bluebird");
const lighthouse = require('./tools/lighthouse');

const lighthouse_options = {
  quite: true,
  chromeFlags: ['--headless']
};

const timeout_in_seconds = 2;

module.exports = {
  runAnalysis: function(url){
    return new Promise((resolve, reject) => {
      var p1 = lighthouse.runLighthouse(url, lighthouse_options);
      var p2 = new Promise(function(resolve, reject) {
        setTimeout(reject, 1000 * timeout_in_seconds, {error: 'Timeout occurred (timeout set to ' + timeout_in_seconds + ' sec)'});
      });

      Promise.race([p1, p2]).then(function(results) {
        global.chrome_child_process.kill().then(() => {
          resolve(results);
        })
      })
      .catch(err => {
        global.chrome_child_process.kill().then(() => {
          reject(err);
        })
      })
    });
  }
};