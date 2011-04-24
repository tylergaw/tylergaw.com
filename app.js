/**
 * This is where we create the express server. Not much to it,
 * just create a new server and pass it off to our mvc bootin'
 *
 */
var express = require('express'),
	app     = express.createServer();

require('./mvc').boot(app);

app.listen(3000);
console.log('Express app started on port 3000');