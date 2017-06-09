"use strict";
/**
 *    Object containing the middleware of get /cart API
 */
module.exports = {
	"user": function (req, res, next) {
		if(!req.soajs.urac){
			// get from session
			if (req.soajs.session) {
				var sessionObj = req.soajs.session.getSERVICE();
				var cart = {
					count: 0,
					items: []
				};
				if (sessionObj && sessionObj.cart && sessionObj.cart.items) {
					sessionObj.cart.count = sessionObj.cart.items.length;
					cart = sessionObj.cart;
				}
				return res.soajs.returnAPIResponse(req, res, {code: 400, error: false, data: cart});
			}
		}
		else {
			return next();
		}
	},
	"get": function (req, res) {
		var user = req.soajs.urac;
		if(!user || user._id.toString() !== req.soajs.inputmaskData.userId){
			return res.soajs.returnAPIResponse(req, res, {code: 406, error: req.soajs.config.errors[406]});
		}
		var opts = {
			"condition": {
				"userId": req.soajs.inputmaskData.userId,
				"infos": {
					$exists: 0
				}
			}
		};
		
		req.soajs.model.findEntries(req.soajs, opts, function (error, response) {
			var cart = {};
			if (response) {
				cart = {
					count: response.length,
					items: response
				};
			}
			return res.soajs.returnAPIResponse(req, res, {code: 401, error: error, data: cart});
		});
	}
};