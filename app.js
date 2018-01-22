const express = require('express');
const app = express();

const steem = require('steem');
steem.api.setOptions({ url: 'https://api.steemit.com' });

function totalPowerUps(data) {
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i][1].op[0] === 'transfer_to_vesting') {
      let transferString = data[i][1].op[1].amount;
      total += Number(transferString.substr(0, transferString.indexOf(' ')));
    }
  }
  return total.toString();
}

function createHistoryPromise(accountName, limit) {
  return new Promise((resolve, reject) => {
    steem.api.getAccountHistory(accountName, -1, limit, function(err, result) {
      if (!err) resolve(totalPowerUps(result));
    });
  });
}

let nameArray = [
  'jeffbernst',
  'exyle',
  'louisthomas',
  'cryptoctopus',
  'dan',
  'jerrybanfield',
  'ned'
];

let namePromiseArray = nameArray.map(name => createHistoryPromise(name, 1000));

let resultsArray = [];

async function resolvePromises() {
  for (let i = 0; i < namePromiseArray.length; i++) {
    let result = await namePromiseArray[i];
    resultsArray.push(`${nameArray[i]}: ${result}`);
  }
}

let promiseExecution = resolvePromises();

app.get('/', async (req, res) => {
  await promiseExecution;
  res.send(resultsArray);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

// function totalPowerUps(data) {
//   return data
//     .filter(trx => trx[1].op[0] === 'transfer_to_vesting')
//     .reduce((acc, cur) => {
//       return (
//         acc + Number(cur[1].op[0].amount.substr(0, cur.amount.indexOf(' ')))
//       );
//     });
// }
