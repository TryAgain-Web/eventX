const express = require('express');
const { body } = require('express-validator');
const eventsController = require('../controllers/events');

const router = express.Router();

const createEventValidation = [
  body('user_id').isInt({ min: 1 }).withMessage('Valid user id is required'),
  body('title').trim().notEmpty().isLength({ max: 150 }).withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('event_date').notEmpty().withMessage('Event date is required'),
  body('status').optional().isIn(['active', 'cancelled']).withMessage('Invalid status')
];

router.get('/', eventsController.getEvents);
router.post('/', createEventValidation, eventsController.createEvent);

module.exports = router;

