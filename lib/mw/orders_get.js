'use strict';
/**
 *	Object containing the middleware of get /orders API
 */
module.exports = {
	"getAll": function (req, res) {
		var user = req.soajs.urac;
		if(!user || user._id.toString() !== req.soajs.inputmaskData.userId){
			return res.soajs.returnAPIResponse(req, res, {code: 406, error: req.soajs.config.errors[406]});
		}
		
		var opts = {
			"condition": {
				"userId": req.soajs.inputmaskData.userId,
				"infos": {$exists: true}
			}
		};
		
		req.soajs.model.findEntries(req.soajs, opts, function (error, response) {
			return res.soajs.returnAPIResponse(req, res, {code: 600, error: error, data: response});
		});
	}
};