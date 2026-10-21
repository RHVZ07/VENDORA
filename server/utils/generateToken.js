const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vendora_default_secret_key_2026', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
