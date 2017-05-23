"use strict";
/**
 *	Object containing the middleware of /cart/checkout API
 */
module.exports = {
	"checkout": function (req, res) {
		var user = req.soajs.uracDriver.getProfile();
		if(!user || user._id.toString() !== req.soajs.inputmaskData.userId){
			return res.soajs.returnAPIResponse(req, res, {code: 406, error: req.soajs.config.errors[406]});
		}
		
		var opts1 = {
			"condition": {},
			"updatedFields": {
				$inc: {
					"pet.quantity": -req.soajs.inputmaskData.quantity
				}
			},
			"database": "petStore",
			"collection": "pets"
		};
		opts1.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.petId);
		req.soajs.model.updateEntries(req.soajs, opts1, function (error) {
			if(!error){
				var opts = {
					"condition": {},
					"updatedFields":{"$set": {"infos": req.soajs.inputmaskData.infos}}
				};
				opts.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.id);
				req.soajs.model.updateEntries(req.soajs, opts, function (error, response) {
					if(!error){
						return res.soajs.returnAPIResponse(req, res, {code: 404, error: error, data: response});
					}
				});
			}
		});
	}
};