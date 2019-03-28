const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const bfj = require('bfj');
const _ = require('lodash');
const Promise = require("bluebird");

const opts = {
  quite: true,
  chromeFlags: ['--timeout 10000', '--headless']
};

Promise.config({
	cancellation: true
});

function launchChromeAndRunLighthouse(storingDir, url, opts, config = null) {
  console.log(url)
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    console.log('Chrome launched');
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      console.log('Lighthouse ended');
      // The gathered artifacts are typically removed as they can be quite large (~50MB+)
      delete results.artifacts;
      delete results.report;
      return chrome.kill().then(() => {
        console.log('Chrome killed');
        return Promise.resolve(results);
      })
    }).catch(error => {
      return Promise.reject(error);
    })
  }).catch(error => {
    return Promise.reject({"LighthouseError": error});
  })
}

const launchChromeAndRunLighthouseAsync = Promise.promisify(launchChromeAndRunLighthouse);

module.exports = {
  runLighthouse: launchChromeAndRunLighthouse
};