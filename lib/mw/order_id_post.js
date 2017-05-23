"use strict";
/**
 *	Object containing the middleware of /order/:id API
 */
module.exports = {
	"confirm": function (req, res) {
		var opts = {
			"condition": {},
			"updatedFields": {
				"$set": {
					"pet.status": "ready",
					"pickupDate": req.soajs.inputmaskData.pickupDate
				}
			}
		};
		opts.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.id);
		req.soajs.model.updateEntries(req.soajs, opts, function (error, response) {
			if (error){
				return res.soajs.returnAPIResponse(req, res, {code: 600, error: error});
			} else {
				var opts1 = {
					"condition": {}
				};
				opts1.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.id);
				req.soajs.model.findEntry(req.soajs, opts1, function (error, record) {
					if(error || !record){
						return res.soajs.returnAPIResponse(req, res, {code: 405, error: error});
					} else {
						var data = {
							"firstName": record.infos.firstName,
							"lastName": record.infos.lastName,
							"pickupDate": new Date(record.pickupDate).toDateString(),
							"email": record.infos.email
						};
						var apiName = 'confirm';
						req.soajs.model.sendMail(apiName, req, data, function (error) {
							return res.soajs.returnAPIResponse(req, res, {code: 400, error: error, data: response});
						});
					}
				});
			}
		});
	}
};