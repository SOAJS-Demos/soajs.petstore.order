"use strict";
/**
 *    Object containing the middleware of /cart/:id API
 */
module.exports = {
	"user": function (req, res, next) {
		if(!req.soajs.urac){
			// get from session
			if (req.soajs.session) {
				var sessionObj = req.soajs.session.getSERVICE();
			}
			if (sessionObj.cart && sessionObj.cart.items) {
				for (var i = 0; i < sessionObj.cart.items.length; i++) {
					if (sessionObj.cart.items[i].petId === req.soajs.inputmaskData.id) {
						sessionObj.cart.items.splice(i, 1);
					}
				}
				req.soajs.session.setSERVICE(sessionObj, function () {
					return res.soajs.returnAPIResponse(req, res, {code: 400, error: false, data: sessionObj.cart});
				});
			}
		}
		else {
			return next();
		}
	},
	"deleteCart": function (req, res) {
		var user = req.soajs.urac;
		if(!user || user._id.toString() !== req.soajs.inputmaskData.userId){
			return res.soajs.returnAPIResponse(req, res, {code: 406, error: req.soajs.config.errors[406]});
		}
		var opts = {
			"condition": {"userId": req.soajs.inputmaskData.userId},
			"database": "orders",
			"collection": "orders"
		};
		opts.condition["_id"] = req.soajs.model.object_Id(req.soajs, req.soajs.inputmaskData.id);
		req.soajs.model.deleteEntries(req.soajs, opts, function (error, response) {
			return res.soajs.returnAPIResponse(req, res, {code: 401, error: error, data: response});
		});
	}
};