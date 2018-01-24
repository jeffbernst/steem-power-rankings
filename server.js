const express = require('express');
const app = express();

app.use(express.static('public', {extensions: ['html', 'htm']}));

app.use('/node_modules', express.static('node_modules'));

if (require.main === module) {
	app.listen(process.env.PORT || 8080, function () {
		console.info(`App listening on ${this.address().port}`);
	});
}