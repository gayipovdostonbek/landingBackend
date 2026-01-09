/**
 * Contact Controller
 * Handles HTTP requests for contact operations
 */

const contactService = require('../services/contact.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create a new contact
 * @route POST /api/contact
 */
const createContact = asyncHandler(async (req, res) => {
  const contact = await contactService.createContact(req.body);

  res.status(201).json({
    status: 'success',
    data: contact,
  });
});

/**
 * Get contact by ID
 * @route GET /api/contact/:id
 */
const getContact = asyncHandler(async (req, res) => {
  const contact = await contactService.getContactById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: contact,
  });
});

/**
 * Get all contacts
 * @route GET /api/contacts
 */
const getAllContacts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const offset = (page - 1) * limit;

  const result = await contactService.getAllContacts({ limit, offset });

  res.status(200).json({
    status: 'success',
    data: result.contacts,
    pagination: {
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
    },
  });
});

module.exports = {
  createContact,
  getContact,
  getAllContacts,
};
