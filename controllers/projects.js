/**
 * Projects controller
 *
 */
module.exports = {
	index: function (req, res)
	{
		res.render('projects');
	},
	
	show: function (req, res, next)
	{
		res.render('projects/show', {project: req.params.id});
 	}
};