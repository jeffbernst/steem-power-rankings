const express = require('express');
const steem = require('steem');

const app = express();

steem.api.setOptions({ url: 'https://api.steemit.com' });

let jeffData;

steem.api.getAccountHistory('jeffbernst', -1, 1035, function(err, result) {
  jeffData = result;
});

function totalTransfers(data) {
  let total = 0;
  for (let i = 0; i < jeffData.length; i++) {
    if (jeffData[i][1].op[0] === 'transfer_to_vesting') {
      let transferString = jeffData[i][1].op[1].amount;
      total += Number(transferString.substr(0, transferString.indexOf(' ')));
    }
  }
  return total.toString();
}

app.get('/', (req, res) => {
  res.send(totalTransfers(jeffData));
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));
