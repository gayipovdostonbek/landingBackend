/**
 * Contact Repository
 * Database access layer for contact operations
 */

const db = require('../config/database');
const logger = require('../config/logger');

/**
 * Create a new contact
 * @param {Object} contactData - Contact data
 * @returns {Promise<Object>} Created contact
 */
const create = async (contactData) => {
  const { name, email, message } = contactData;

  const query = `
    INSERT INTO contacts (name, email, message)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, message, created_at
  `;

  const values = [name, email, message];

  try {
    const result = await db.query(query, values);
    logger.debug('Contact created', { id: result.rows[0].id });
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating contact', { error: error.message });
    throw error;
  }
};

/**
 * Find contact by ID
 * @param {number} id - Contact ID
 * @returns {Promise<Object|null>} Contact or null
 */
const findById = async (id) => {
  const query = 'SELECT * FROM contacts WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Find all contacts
 * @param {Object} options - Query options (limit, offset)
 * @returns {Promise<Array>} Array of contacts
 */
const findAll = async (options = {}) => {
  const { limit = 100, offset = 0 } = options;
  
  const query = `
    SELECT id, name, email, message, created_at
    FROM contacts
    ORDER BY created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await db.query(query, [limit, offset]);
  return result.rows;
};

/**
 * Count total contacts
 * @returns {Promise<number>} Total count
 */
const count = async () => {
  const query = 'SELECT COUNT(*) FROM contacts';
  const result = await db.query(query);
  return parseInt(result.rows[0].count, 10);
};

module.exports = {
  create,
  findById,
  findAll,
  count,
};
