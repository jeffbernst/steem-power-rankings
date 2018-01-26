steem.api.setOptions({ url: 'https://api.steemit.com' });

function handleSubmitQuery() {
	$('#search-form').submit(async function(event) {
		event.preventDefault();
		console.log('searching');
		$('.error').html('');
		$('.results').html('<img src="pacman.gif" alt="loading">');

		const transactionsCount = $('.transactions-count').val();
		const startDate = $('.start-date').val();
		const endDate = $('.end-date').val();
		const usersToSearch = $('.users-to-search').val().replace(/\s/g, '').split(',');

		let namePromiseArray = [];

		for (let [index, name] of usersToSearch.entries()) {
			if (index % 5 === 0) await sleep(1000);
			namePromiseArray.push(createHistoryPromise(name, transactionsCount, startDate, endDate))
		}

		let resultsArray = [];
		let promiseExecution = resolvePromises(namePromiseArray, usersToSearch, resultsArray);

		waitForPromisesThenAppendResults(promiseExecution, resultsArray);
	});
}

async function waitForPromisesThenAppendResults(promiseExecution, resultsArray) {
	await promiseExecution;

	let error = checkResultsForError(resultsArray);
	if (error) $('.error').text('The app needs more transactions for this search. Please increase the value above and search again.');

	let sortedResults = resultsArray.sort((a,b) => b.total - a.total);
	let resultsHtml = createResultsTable(sortedResults);
	$('.results').html(resultsHtml);
}

function checkResultsForError(resultsArray) {
	let found = resultsArray.some(function (el) {
		return el.total === 'need more transactions';
	});
	return found;
}

function createResultsTable(resultsObj) {
	let tableString = resultsObj.map((user, index) => {
		return `<tr><td>${index+1})</td><td>${user.name}</td><td>${user.total}</td></tr>`
	}).join('');
	let resultsHtmlString = `<table>${tableString}</table>`
	return resultsHtmlString;
}

function totalPowerUps(data, startDate, endDate) {
  let total = 0;
	let startDateObj = moment().format(startDate);
	let endDateObj = moment().format(endDate);

	let dataStartDate = moment().format(data[0][1].timestamp);
	if (dataStartDate > startDateObj) return 'need more transactions';

  for (let i = 0; i < data.length; i++) {
    if (data[i][1].op[0] === 'transfer_to_vesting') {
    	let transferDate = moment().format(data[i][1].timestamp);
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
    resultsArray.push({name: nameArray[i], total: result});
  }
}

function sleep(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, ms);
	})
}

$(handleSubmitQuery());
