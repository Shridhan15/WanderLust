const Joi = require('joi');

//schema for serverside validation, we are using this to validate listing schema
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.number().allow("", null),
 
    }).required
})