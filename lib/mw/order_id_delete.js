"use strict";
/**
 *    Object containing the middleware of /order/:id API
 */
module.exports = {
	"deleteOrder": function (req, res) {
		var opts2 = {
			"condition": {},
			"database": "orders",
			"collection": "orders"
		};
		opts2.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.id);
		req.soajs.model.findEntry(req.soajs, opts2, function (error, response1) {
			if (error) {
				return res.soajs.returnAPIResponse(req, res, {code: 600, error: error});
			} else {
				var opts1 = {
					"condition": {},
					"updatedFields": {$inc: {"pet.quantity": response1.pet.quantity}},
					"database": "petStore",
					"collection": "pets"
				};
				opts1.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.petId);
				req.soajs.model.updateEntries(req.soajs, opts1, function (error) {
					if (error) {
						return res.soajs.returnAPIResponse(req, res, { code: 403, error: error });
					} else {
						var opts = {
							"condition": {}
						};
						var data = {
							"firstName": response1.infos.firstName,
							"lastName": response1.infos.lastName,
							"email": response1.infos.email
						};
						var apiName = 'reject';
						req.soajs.model.sendMail(apiName, req, data, function (error) {
							if (error) {
								return res.soajs.returnAPIResponse(req, res, {code: 405, error: error});
							}
							else{
								opts.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.id);
								req.soajs.model.deleteEntries(req.soajs, opts, function (error, response) {
									return res.soajs.returnAPIResponse(req, res, { code: 400, error: error, data: response });
								});
							}
						});
					}
				});
			}
		});
	}
};