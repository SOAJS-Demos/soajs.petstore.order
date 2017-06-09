"use strict";
/**
 *    Object containing the middleware of get /cart API
 */
var _ = require("lodash");

module.exports = {
	"session": function (req, res, next) {
		var sessionObj = req.soajs.session.getSERVICE();
		if ((typeof(sessionObj) === 'object') && sessionObj.cart && (sessionObj.cart.items.length !== 0)) {
			return next();
		}
		else {
			// nothing to merge
			return res.soajs.returnAPIResponse(req, res, { data: true });
		}
	},
	
	"get": function (req, res) {
		var user = req.soajs.urac;
		if(!user || user._id.toString() !== req.soajs.inputmaskData.userId){
			return res.soajs.returnAPIResponse(req, res, {code: 406, error: req.soajs.config.errors[406]});
		}
		
		var dbItems;
		var sessionObj = req.soajs.session.getSERVICE();
		sessionObj.cart.items.forEach(function (one) {
			one.userId = req.soajs.inputmaskData.userId;
		});
		var opts = {
			"condition": {
				"userId": req.soajs.inputmaskData.userId,
				"infos": {
					$exists: 0
				}
			}
		};
		
		req.soajs.model.findEntries(req.soajs, opts, function (error, response) {
			var newCart = {
				items: []
			};
			if (response && response.length !== 0) {
				// merge session and DB
				dbItems = response;

				sessionObj.cart.items.forEach(function (one) {
					var found = false;
					for (var x = 0; x < dbItems.length; x++) {
						if (dbItems[ x ].petId === one.petId) {
							found = true;
							dbItems[ x ].pet.quantity = dbItems[ x ].pet.quantity + one.pet.quantity;
							break;
						}
					}
					if (!found) {
						newCart.items.push(one);
					}
				});

				newCart.items = _.concat(newCart.items, dbItems);

				newCart.items.forEach(function (one) {
					var combo = {
						"record": one
					};
					req.soajs.model.saveEntry(req.soajs, combo, function (error, response) {
						if (error) {
							req.soajs.log.error(error);
						}
					});
				});

				clearSession();
				return res.soajs.returnAPIResponse(req, res, { data: true });
			}
			else {
				// insert data in session into the DB
				var combo = {
					"condition": {},
					"record": sessionObj.cart.items
				};

				req.soajs.model.insertEntries(req.soajs, combo, function (error, response) {
					clearSession();
					return res.soajs.returnAPIResponse(req, res, { code: 600, error: error, data: true });
				});
			}

		});

		function clearSession () {
			sessionObj = {};
			req.soajs.session.setSERVICE(sessionObj);
		}
	}
};