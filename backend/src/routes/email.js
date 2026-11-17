// backend/src/routes/email.js
const express = require('express');
const { getEmails, getEmailById, updateRead, updateImportant, updateArchive, classifyEmail, updateManualClassification, completeConversation } = require('../controllers/emailController');
const protect = require('../middlewares/auth');
const { assistantOnly, clientOnly } = require('../middlewares/role');
const router = express.Router();

router.use(protect);

// General list – filters based on query params; both roles can use (assistant sees all, client limited)
router.get('/', getEmails);

router.get('/:id', getEmailById);
router.patch('/:id/read', updateRead);
router.patch('/:id/important', updateImportant);
router.patch('/:id/archive', updateArchive);
router.patch('/:id/classify', updateManualClassification);
router.patch('/:id/complete', completeConversation);

module.exports = router;

