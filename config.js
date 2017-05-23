"use strict";
module.exports = {
	"type": "service",
	"prerequisites": {
		"cpu": " ",
		"memory": " "
	},
	"swagger": true,
	"dbs": [
		{
			"prefix": "",
			"name": "orders",
			"mongo": true,
			"multitenant": false
		},
		{
			"prefix": "",
			"name": "petStore",
			"mongo": true,
			"multitenant": false
		}
	],
	"models": {
		"path": "/opt/soajs/node_modules/soajs.petstore.services/order/lib/models/",
		"name": "mongo"
	},
	"serviceName": "orders",
	"serviceGroup": "Orders",
	"serviceVersion": 1,
	"servicePort": 5216,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"extKeyRequired": true,
	"injection": true,
	"oauth": true,
	"session": true,
	"errors": {
		"400": "No orders found",
		"401": "wrong id",
		"403": "Error restoring the database quantity",
		"402": "Error while adding the pet to the cart",
		"404": "wrong inputs",
		"405": "Error while sending mail",
		"406": "Invalid User provided",
		"600": "error connecting to database"
	},
	"schema": {
		
		"get": {
			"/admin/orders":{
				"_apiInfo": {
					"l": "Manage all Orders",
					"group": "orders"
				},
				"mw": __dirname + "/lib/mw/admin_orders_get.js",
				"imfv": {
					"custom": {
						"start": {
							"required": false,
							"source": [
								"query.start"
							],
							"validation": {
								"type": "integer",
								"default": 0
							}
						},
						"limit": {
							"required": false,
							"source": [
								"query.limit"
							],
							"validation": {
								"type": "integer",
								"default": 100
							}
						}
					}
				}
			},
			"/orders": {
				"_apiInfo": {
					"l": "See My Orders",
					"group": "user orders"
				},
				"mw": __dirname + "/lib/mw/orders_get.js",
				"imfv": {
					"commonFields": ["userId"]
				}
			},
			"/cart": {
				"_apiInfo": {
					"l": "Get My Cart",
					"group": "cart",
					"groupMain": true
				},
				"mw": __dirname + "/lib/mw/cart_get.js",
				"imfv": {
					"commonFields": ["userId"]
				}
			},
			"/mergeCart": {
				"_apiInfo": {
					"l": "Merge Anonymous Cart",
					"group": "cart"
				},
				"mw": __dirname + "/lib/mw/mergeCart_get.js",
				"imfv": {
					"commonFields": ["userId"]
				}
			}
		},
		"delete": {
			"/order/:id": {
				"_apiInfo": {
					"l": "Reject Order",
					"group": "order"
				},
				"mw": __dirname + "/lib/mw/order_id_delete.js",
				"imfv": {
					"custom": {
						"petId": {
							"required": true,
							"source": [
								"query.petId"
							],
							"validation": {
								"type": "string"
							}
						},
						"commonFields": [
							"id"
						]
					}
				}
			},
			"/cart/:id": {
				"_apiInfo": {
					"l": "Remove Item from Cart",
					"group": "cart"
				},
				"mw": __dirname + "/lib/mw/cart_id_delete.js",
				"imfv": {
					"commonFields": ["id", "userId"]
				}
			}
		},
		"post": {
			"/order/:id": {
				"_apiInfo": {
					"l": "Confirm Order",
					"group": "order"
				},
				"mw": __dirname + "/lib/mw/order_id_post.js",
				"imfv": {
					"custom": {
						"pickupDate": {
							"required": true,
							"source": [
								"body.pickupDate"
							],
							"validation": {
								"schema": {
									"type": "string"
								}
							}
						}
					},
					"commonFields": [
						"id"
					]
				}
			},
			"/cart": {
				"_apiInfo": {
					"l": "Add Item to Cart",
					"group": "cart"
				},
				"mw": __dirname + "/lib/mw/cart_post.js",
				"imfv": {
					"commonFields": ["userId"],
					"custom": {
						"petId": {
							"required": true,
							"source": [
								"query.petId"
							],
							"validation": {
								"type": "string"
							}
						},
						"pet": {
							"required": true,
							"source": [
								"body.pet"
							],
							"validation": {
								"type": "object",
								"required": [
									"breed",
									"name",
									"age",
									"gender",
									"photoUrls",
									"quantity",
									"price"
								],
								"properties": {
									"breed": {
										"type": "string"
									},
									"name": {
										"type": "string",
										"example": "doggie"
									},
									"age": {
										"type": "string"
									},
									"gender": {
										"type": "string"
									},
									"color": {
										"type": "string"
									},
									"quantity": {
										"type": "integer"
									},
									"price": {
										"type": "string"
									},
									"photoUrls": {
										"type": "string"
									},
									"description": {
										"type": "string"
									},
									"status": {
										"type": "string",
										"default": "pending"
									}
								}
							}
						}
					}
				}
			},
			"/cart/checkout/:id": {
				"_apiInfo": {
					"l": "Checkout Cart",
					"group": "cart"
				},
				"mw": __dirname + "/lib/mw/cart_checkout_post.js",
				"imfv": {
					"commonFields": ["id", "userId"],
					"custom": {
						"petId": {
							"required": true,
							"source": [
								"query.petId"
							],
							"validation": {
								"type": "string"
							}
						},
						"quantity": {
							"required": true,
							"source": [
								"query.quantity"
							],
							"validation": {
								"type": "integer"
							}
						},
						"infos": {
							"required": true,
							"source": [
								"body.infos"
							],
							"validation": {
								"type": "object",
								"required": [
									"firstName",
									"lastName",
									"email",
									"phone"
								],
								"properties": {
									"firstName": {
										"type": "string"
									},
									"lastName": {
										"type": "string"
									},
									"email": {
										"type": "string",
										"format": "email"
									},
									"phone": {
										"type": "string"
									}
								}
							}
						}
					}
				}
			}
		},
		"commonFields": {
			"userId": {
				"source": ['query.userId'],
				"required": false,
				"validation": {
					"type": "string"
				}
			},
			"id": {
				"required": true,
				"source": [
					"params.id"
				],
				"validation": {
					"type": "string"
				}
			}
		}
	}
};