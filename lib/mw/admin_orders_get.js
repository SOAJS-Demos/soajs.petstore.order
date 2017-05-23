'use strict';
/**
 *	Object containing the middleware of get /orders API
 */
module.exports = {
	"getAll": function (req, res) {
		var opts = {
			"condition": {
				"infos": {$exists: true}
			},
			"options": {
				"skip": req.soajs.inputmaskData.start,
				"limit": req.soajs.inputmaskData.limit
			}
		};
		
		req.soajs.model.countEntries(req.soajs, opts, function (error, count) {
			var data = {
				"count": 0,
				"records": []
			};
			if(!error) {
				data.count = count;
			}
			if (data.count === 0) {
				return res.soajs.returnAPIResponse(req, res, {code: 400, error: error, data: data});
			} else {
				req.soajs.model.findEntries(req.soajs, opts, function (error, response) {
					if (!error) {
						data.records = response;
					}
					return res.soajs.returnAPIResponse(req, res, {code: 600, error: error, data: data});
				});
			}
		});
	}
};