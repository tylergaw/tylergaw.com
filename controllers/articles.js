/**
 * Writing controller
 *
 */
var sys        = require('sys'),
	mongodb    = require('mongodb');
	server     = new mongodb.Server('localhost', 27017, {}),	
	collection = null,
	articles   = null;

// Create a connection to our database
new mongodb.Db('tylergaw', server, {}).open(function (err, client)
{
	if (err) throw error;
	
	collection = new mongodb.Collection(client, 'articles');
	
	// Find the list of articles in the collection and
	// store it for later use.
	collection.find({}, function (err, cursor)
	{
		cursor.toArray(function (err, docs)
		{
			articles = docs;
		});
	});
});

module.exports = {
	index: function (req, res)
	{
		res.render('articles', {articles: articles, activeId: 'articles'});
	},
	
	show: function (req, res, next)
	{
		collection.find({slug: req.params.id}, {limit: 1}, function (err, cursor)
		{
			cursor.toArray(function (err, article)
			{
				res.render('articles/show', {article: article[0]});
			});
		});
 	}
};