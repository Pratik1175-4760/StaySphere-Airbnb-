import Joi from 'joi';

export const listingSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must be less than 100 characters',
    }),
  
  description: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 20 characters',
    }),
  
  price: Joi.number()
    .positive()
    .max(1000000)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be greater than 0',
      'number.max': 'Price seems too high',
      'any.required': 'Price is required',
    }),
  
  location: Joi.string()
    .required()
    .messages({
      'string.empty': 'Location is required',
    }),
  
  country: Joi.string()
    .required()
    .messages({
      'string.empty': 'Country is required',
    }),
  
  image: Joi.object({
    filename: Joi.string(),
    url: Joi.string()
      .uri()
      .required()
      .messages({
        'string.empty': 'Image URL is required',
        'string.uri': 'Please enter a valid URL',
      }),
  }),
});