"use strict";
/**
 *    Object containing the middleware of /cart API
 */
module.exports = {
	"user": function (req, res, next) {
		var sessionObj;
		if (!req.soajs.urac) {
			// get from session
			if (req.soajs.session) {
				sessionObj = req.soajs.session.getSERVICE();
				
				if (!sessionObj) {
					sessionObj = {};
				}
				if (!sessionObj.cart) {
					sessionObj.cart = {};
				}
				if (!sessionObj.cart.items) {
					sessionObj.cart.items = [];
				}
				for (var i = 0; i < sessionObj.cart.items.length; i++) {
					if(sessionObj.cart.items[i].petId === req.soajs.inputmaskData.petId){
						sessionObj.cart.items[i].pet.quantity = sessionObj.cart.items[i].pet.quantity + req.soajs.inputmaskData.pet.quantity;
						var modified = true;
					}
					
				}
				if(!modified){
					var obj = {
						"petId": req.soajs.inputmaskData.petId,
						"pet": req.soajs.inputmaskData.pet
					};
					obj.pet["status"] = "pending";
					sessionObj.cart.items.push(obj);
				}
				
				// push into array
				req.soajs.session.setSERVICE(sessionObj, function () {
					return res.soajs.returnAPIResponse(req, res, {code: 400, error: false, data: sessionObj.cart});
				});
			}
		}
		else {
			return next();
		}
	},
	"post": function (req, res) {
		var user = req.soajs.urac;
		if(!user || user._id.toString() !== req.soajs.inputmaskData.userId){
			return res.soajs.returnAPIResponse(req, res, {code: 406, error: req.soajs.config.errors[406]});
		}
		var opts1 = {
			"condition": {
				"userId": req.soajs.inputmaskData.userId,
				"petId": req.soajs.inputmaskData.petId,
				"infos": {
					$exists: 0
				}
			},
			"updatedFields": {
				$inc: {
					"pet.quantity": req.soajs.inputmaskData.pet.quantity
				}
			}
		};
		req.soajs.model.updateEntries(req.soajs, opts1, function (error, response) {
			if(response){
				return res.soajs.returnAPIResponse(req, res, {code: 404, error: error, data: response});
			} else {
				var opts = {
					"condition": {},
					"record": {
						"petId": req.soajs.inputmaskData.petId,
						"userId": req.soajs.inputmaskData.userId,
						"pet": req.soajs.inputmaskData.pet
					}
				};
				opts.record.pet["status"] = "pending";
				req.soajs.model.insertEntries(req.soajs, opts, function (error, response) {
					if (error) {
						return res.soajs.returnAPIResponse(req, res, {code: 402, error: error});
					} else {
						return res.soajs.returnAPIResponse(req, res, {code: 400, error: error, data: response});
					}
				});
			}
		});
		
	}
};