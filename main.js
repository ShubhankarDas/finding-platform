const csvtojson = require('csvtojson');
const fs = require('fs');
const URL = require('url').URL;
const Wappalyzer = require('wappalyzer');

const options = {
  debug: false,
  delay: 500,
  maxDepth: 3,
  maxUrls: 10,
  maxWait: 5000,
  recursive: true,
  userAgent: 'Wappalyzer',
  htmlMaxCols: 2000,
  htmlMaxRows: 2000,
};

let recordsList = [];

function processData(index) {
  const data = recordsList[index];

  if (index > recordsList.length) {
    return;
  }

  setTimeout(processData, 10000, index + 1);

  if (!data) {
    return;
  }

  if (!data.Website) {
    return;
  }

  const wappalyzer = new Wappalyzer(data.Website, options);

  wappalyzer.analyze()
    .then(platformDetails => {
      console.log(platformDetails);
      data.Platform = platformDetails;
      fs.appendFileSync('./result.json', `\n${JSON.stringify(data)}`); 
    })
    .catch(err => {
      console.error(err);
    });
}

const dataStream = csvtojson().fromFile('./input.csv');

dataStream.on('json', data => recordsList.push(data)).on('done', error => {
  recordsList = recordsList.slice(0, 10);
  processData(0);
});