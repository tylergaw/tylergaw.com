/**
 * Info controller
 *
 */
module.exports = {
	index: function (req, res)
	{
		res.render('info', {activeId: 'info'});
	}
};