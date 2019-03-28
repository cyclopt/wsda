const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const Promise = require("bluebird");

Promise.config({cancellation: true});

/**
 * @param {string} url The url of the website
 * @param {JSON} opts execution options
 * @param {JSON} config configuration
 * @returns {promise} The analysis results
 */
const launchChromeAndRunLighthouse = function(url, opts, config = null) {
  const start = new Date();

  return chromeLauncher.launch({chromeFlags: opts.chromeFlags}).then(chrome => {
    global.chrome_child_process = chrome;
    opts.port = chrome.port;

    return lighthouse(url, opts, config).then(results => {
      // The gathered artifacts are typically removed as they can be quite large (~50MB+)
      delete results.artifacts;
      delete results.report;

      return chrome.kill().then(() => {
        const elTime = new Date() - start;

        return Promise.resolve({"lighthouse_results": results, "analysis_duration": elTime + "ms"});
      })
    }).catch(error => {

      return Promise.reject(error);
    })
  }).catch(error => {

    return Promise.reject({"LighthouseError": error});
  })
}

module.exports = {
  runLighthouse: launchChromeAndRunLighthouse
};