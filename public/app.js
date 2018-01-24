steem.api.setOptions({ url: 'https://api.steemit.com' });

function handleSubmitQuery() {
	$('#search-form').submit(function(event) {
		event.preventDefault();
		console.log('searching');

		const transactionsCount = $('.transactions-count').val();
		const startDate = $('.start-date').val();
		const endDate = $('.end-date').val();
		const usersToSearch = $('.users-to-search').val().split(',');

		let namePromiseArray = usersToSearch.map(name => createHistoryPromise(name, transactionsCount, startDate, endDate));

		let resultsArray = [];
		let promiseExecution = resolvePromises(namePromiseArray, usersToSearch, resultsArray);

		waitForPromisesThenAppendResults(promiseExecution, resultsArray);
	});
}

async function waitForPromisesThenAppendResults(promiseExecution, resultsArray) {
	await promiseExecution;
	let sortedResults = resultsArray.sort((a,b) => b.total - a.total);
	let resultsHtml = createResultsTable(sortedResults);
	$('.results').html(resultsHtml);
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
    resultsArray.push({name: nameArray[i], total: result});
  }
}

$(handleSubmitQuery());
