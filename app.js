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

let totalPowerUpsVal;

steem.api.getAccountHistory('jeffbernst', -1, 1000, function(err, result) {
  if (!err) totalPowerUpsVal = totalPowerUps(result);
});

app.get('/', (req, res) => {
  res.send(totalPowerUpsVal);
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
