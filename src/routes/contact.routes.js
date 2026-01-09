/**
 * Contact Routes
 * Defines routes for contact operations
 */

const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const validate = require('../middleware/validator');
const { createContactSchema } = require('../validators/contact.validator');

/**
 * @route   POST /api/contact
 * @desc    Create a new contact
 * @access  Public
 */
router.post('/', validate(createContactSchema), contactController.createContact);

/**
 * @route   GET /api/contact/:id
 * @desc    Get contact by ID
 * @access  Public
 */
router.get('/:id', contactController.getContact);

/**
 * @route   GET /api/contacts
 * @desc    Get all contacts
 * @access  Public
 */
router.get('/', contactController.getAllContacts);

module.exports = router;
