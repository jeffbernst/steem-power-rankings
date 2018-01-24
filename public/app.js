// const steem = require('steem');
// steem.api.setOptions({ url: 'https://api.steemit.com' });

function handleSubmitQuery() {
	$('#searchform').submit(function(event) {
		event.preventDefault();
		console.log('searching');

		const transactionsCount = $('.transactions-count').val();
		const startDate = $('.start-date').val();
		const endDate = $('.end-date').val();
		const usersToSearch = $('.usersToSearch').val();

		let namePromiseArray = usersToSearch.map(name => createHistoryPromise(name, transactionsCount, startDate, endDate));

		let resultsArray = [];
		let promiseExecution = resolvePromises(namePromiseArray, usersToSearch, resultsArray);

		waitForPromisesThenAppendResults(promiseExecution, resultsArray);
	});
}

async function waitForPromisesThenAppendResults(promiseExecution, resultsArray) {
	await promiseExecution;
	$('.results').append(resultsArray);
}

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

function createHistoryPromise(accountName, limit, startDate, endDate) {
  return new Promise((resolve, reject) => {
    steem.api.getAccountHistory(accountName, -1, limit, function(err, result) {
      if (!err) resolve(totalPowerUps(result, startDate, endDate));
    });
  });
}

async function resolvePromises(promiseArray, nameArray, resultsArray) {
  for (let i = 0; i < promiseArray.length; i++) {
    let result = await promiseArray[i];
    resultsArray.push(`${nameArray[i]}: ${result}`);
  }
}

$(handleSubmitQuery());

// function totalPowerUps(data) {
//   return data
//     .filter(trx => trx[1].op[0] === 'transfer_to_vesting')
//     .reduce((acc, cur) => {
//       return (
//         acc + Number(cur[1].op[0].amount.substr(0, cur.amount.indexOf(' ')))
//       );
//     });
// }
