module.exports = function (wallaby) {
	return {
		files: [
			'app.js',
			'index.html'
		],

		tests: [
			'**/*.spec.js'
		],

		testFramework: 'mocha',

		env: {
			type: 'node',
			runner: 'node'
		},

		workers: {
			initial: 1,
			regular: 1
			// restart: true
		},

		debug: true
	};
};