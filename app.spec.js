const chai = require('chai');
const {totalPowerUps} = require('./app');

expect = chai.expect;

describe('totalPowerUps', () => {
	const SAMPLE_TRANSACTIONS = [
		[1, {
			"trx_id": "9c5e88a97ef0cf2d7b639e54a835a9699e9b2b16",
			"block": 19126254,
			"trx_in_block": 4,
			"op_in_trx": 0,
			"virtual_op": 0,
			"timestamp": "2018-01-19T22:22:57",
			"op": [
				"comment",
				{
					"parent_author": "raizel",
					"parent_permlink": "re-jeffbernst-re-raizel-re-jeffbernst-teaching-english-in-japan-as-an-alt-20180119t220058008z",
					"author": "jeffbernst",
					"permlink": "re-raizel-re-jeffbernst-re-raizel-re-jeffbernst-teaching-english-in-japan-as-an-alt-20180119t222256705z",
					"title": "",
					"body": "Awesome! I just joined steemit chat -- been meaning to anyway. My name on there is also jeffbernst.",
					"json_metadata": "{\"tags\":[\"japan\"],\"app\":\"steemit/0.1\"}"
				}
			]
		}], [2, {
			"trx_id": "a355bcfe75fe671865452651702faf4e2629e283",
			"block": 19124421,
			"trx_in_block": 1,
			"op_in_trx": 0,
			"virtual_op": 0,
			"timestamp": "2018-01-19T20:51:15",
			"op": [
				"vote",
				{
					"voter": "jeffbernst",
					"author": "raizel",
					"permlink": "re-jeffbernst-teaching-english-in-japan-as-an-alt-20180119t172929514z",
					"weight": 10000
				}
			]
		}], [3, {
			"trx_id": "fee93f921e66b5ea17549ef363016b48cf2f86ed",
			"block": 18888666,
			"trx_in_block": 20,
			"op_in_trx": 0,
			"virtual_op": 0,
			"timestamp": "2018-01-11T16:14:42",
			"op": [
				"transfer_to_vesting",
				{
					"from": "jeffbernst",
					"to": "jeffbernst",
					"amount": "18.500 STEEM"
				}
			]
		}]
	];

	it('should return a sum of transfer_to_vesting transactions within the date range', () => {
		let sum = totalPowerUps(SAMPLE_TRANSACTIONS, 'January 10, 2018', 'January 12, 2018');
		expect(sum).to.equal(18.5);
	})
})