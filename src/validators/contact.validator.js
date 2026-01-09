/**
 * Contact Validation Schema
 * Defines validation rules for contact form data
 */

const Joi = require('joi');

/**
 * Contact creation schema
 */
const createContactSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 255 characters',
      'any.required': 'Name is required',
    }),

  email: Joi.string()
    .trim()
    .email()
    .max(255)
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be a valid email address',
      'string.max': 'Email must not exceed 255 characters',
      'any.required': 'Email is required',
    }),

  message: Joi.string()
    .trim()
    .min(10)
    .max(5000)
    .required()
    .messages({
      'string.empty': 'Message is required',
      'string.min': 'Message must be at least 10 characters long',
      'string.max': 'Message must not exceed 5000 characters',
      'any.required': 'Message is required',
    }),
});

module.exports = {
  createContactSchema,
};
