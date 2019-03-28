const dbmanager = require('./utilities/dbmanager');
const bfj = require('bfj');
const Promise = require("bluebird");
const lighthouse = require('./tools/lighthouse');
//const wappalyzer = require('./tools/wappalyzer');

const storingDir = './dataset';

const opts = {
  quite: true,
  chromeFlags: ['--timeout 10000', '--headless']
};

//const website = 'http://www.google.com';
// var p1 = lighthouse.runLighthouse(storingDir + `/${website.replace(/(^\w+:|^)\/\//, '')}`, website, opts);

// var p2 = new Promise(function(resolve, reject) {
//   setTimeout(reject, 1000, 'two');
// });

// Promise.race([p1, p2]).then(function(value) {
//   console.log(value);
//   //process.exit();
// // Both resolve, but promise2 is faster
// })
// .catch(() =>{
//   console.log('timeout occurred');
// })
// .finally(() => {
//   process.exit();
// });

// // Run analysis
// bfj.read(`./top-5-websites.json`).then(websites => {
//   console.log('Read file');
//   return Promise.mapSeries(Object.keys(websites), (website)=> {
//     const category = websites[website];
//     console.log(`Checking website: ${website} of category ${category}`)
//     return dbmanager.initDatasetFolderStructure(storingDir, website.replace(/(^\w+:|^)\/\//, '')).then(val =>{
//       if(category === 'Pornography') {
//         console.log('Skipping...pornography')
//         return Promise.resolve('Porn');
//       } else {
//         console.log('Launching chrome');
//         return lighthouse.runLighthouse(storingDir + `/${website.replace(/(^\w+:|^)\/\//, '')}`, website, opts)
//         // .then(tmp =>{
//         //   return wappalyzer.runWappalyzer(storingDir + `/${website.replace(/(^\w+:|^)\/\//, '')}`, website);
//         // });
//       }
//     })
//   });
// }).catch(error => {
//   console.log(error);
// })
// .finally(() => {
//   console.log('Analysis Finished Successfully');
// });

module.exports = {
  runAnalysis: function(url){
    return new Promise((resolve, reject) => {
      var p1 = lighthouse.runLighthouse(storingDir + `/${url.replace(/(^\w+:|^)\/\//, '')}`, url, opts);
      var p2 = new Promise(function(resolve, reject) {
        setTimeout(reject, 100000, 'Timeout occurred');
      });

      Promise.race([p1, p2]).then(function(value) {
        resolve(value);
        //process.exit();
      // Both resolve, but promise2 is faster
      })
      .catch(err => {
        reject(err);
      })
    });
  }
};

module.exports.runAnalysis('http://www.google.com').then(res => {
  console.log(JSON.stringify(res))
})
.catch(err => {
  console.log(err)
})
.finally(() => {
  process.exit()
});