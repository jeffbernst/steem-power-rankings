const express = require('express');
const app = express();

const steem = require('steem');
steem.api.setOptions({ url: 'https://api.steemit.com' });

function totalPowerUps(data, startDate, endDate) {
  let total = 0;
	let startDateObj = new Date(startDate);
	let endDateObj = new Date(endDate);
	let dataStartDate = new Date(data[0][1].timestamp);
	if (dataStartDate > startDateObj) return 'need more transactions';
  for (let i = 0; i < data.length; i++) {
    if (data[i][1].op[0] === 'transfer_to_vesting') {
    	let transferDate = new Date(data[i][1].timestamp);
			let transferString = data[i][1].op[1].amount;
    	if (transferDate >= startDateObj && transferDate <= endDateObj) {
				total += Number(transferString.substr(0, transferString.indexOf(' ')));
			}
    }
  }
  return total
}

// steem.api.getAccountHistory('jassennessaj', -1, 1000, function(err, result) {
// 	if (!err) console.log(result);
// });

function createHistoryPromise(accountName, limit) {
  return new Promise((resolve, reject) => {
    steem.api.getAccountHistory(accountName, -1, limit, function(err, result) {
      if (!err) resolve(totalPowerUps(result, 'January 14, 2018', 'January 22, 2018'));
    });
  });
}

let nameArray = [
  'jeffbernst',
  'world-travel-pro',
  'jassennessaj',
  'aaronleang'
];

let namePromiseArray = nameArray.map(name => createHistoryPromise(name, 5000));

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

if (require.main === module) {
	app.listen(process.env.PORT || 8080, function () {
		console.info(`App listening on ${this.address().port}`);
	});
}

module.exports = {totalPowerUps};

// function totalPowerUps(data) {
//   return data
//     .filter(trx => trx[1].op[0] === 'transfer_to_vesting')
//     .reduce((acc, cur) => {
//       return (
//         acc + Number(cur[1].op[0].amount.substr(0, cur.amount.indexOf(' ')))
//       );
//     });
// }
