/**
 * index/home controller
 *
 */
module.exports = {
	index: function (req, res)
	{
		res.render('app', {activeId: 'home'});
	}
};