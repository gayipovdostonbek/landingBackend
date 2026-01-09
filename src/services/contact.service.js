/**
 * Contact Service
 * Business logic layer for contact operations
 */

const contactRepository = require('../repositories/contact.repository');
const logger = require('../config/logger');
const AppError = require('../utils/AppError');

/**
 * Create a new contact
 * @param {Object} contactData - Contact data
 * @returns {Promise<Object>} Created contact
 */
const createContact = async (contactData) => {
  try {
    // Additional business logic can be added here
    // For example: email validation, spam detection, etc.
    
    const contact = await contactRepository.create(contactData);
    
    logger.info('New contact created', {
      id: contact.id,
      email: contact.email,
    });

    return contact;
  } catch (error) {
    logger.error('Error in createContact service', { error: error.message });
    throw new AppError('Failed to create contact', 500);
  }
};

/**
 * Get contact by ID
 * @param {number} id - Contact ID
 * @returns {Promise<Object>} Contact
 */
const getContactById = async (id) => {
  const contact = await contactRepository.findById(id);
  
  if (!contact) {
    throw new AppError('Contact not found', 404);
  }

  return contact;
};

/**
 * Get all contacts
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Contacts with pagination info
 */
const getAllContacts = async (options = {}) => {
  const contacts = await contactRepository.findAll(options);
  const total = await contactRepository.count();

  return {
    contacts,
    total,
    page: Math.floor(options.offset / options.limit) + 1 || 1,
    totalPages: Math.ceil(total / (options.limit || 100)),
  };
};

module.exports = {
  createContact,
  getContactById,
  getAllContacts,
};
