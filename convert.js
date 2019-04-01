const fs = require('fs');
const data = require('./result.json');
const csvtojson = require('csvtojson');
const jsonToCsv = require('json2csv');

const recordsList = [];
const formattedData = {};
let totalNotFound = 0;

data.forEach((domainData) => {
  formattedData[domainData.Website] = domainData;
});

const dataStream = csvtojson().fromFile('./input.csv');

function processData(index) {
  const data = recordsList[index];

  if (index > recordsList.length) {
    fs.writeFileSync('./finalResult.json', JSON.stringify(recordsList));
    return;
  }

  if (data && data.Website) {
    if (formattedData[data.Website]) {
      data.Platform = formattedData[data.Website].Platform;
    } else {
      totalNotFound++;
    }
  }

  return processData(index + 1);
}

dataStream.on('json', data => recordsList.push(data)).on('done', error => {
  // recordsList = recordsList.slice(0, 10);
  // counter = recordsList.length;
  processData(0);
});
