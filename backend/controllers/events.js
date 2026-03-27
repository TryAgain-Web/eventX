const { validationResult } = require('express-validator');
const Event = require('../models/event');

exports.getEvents = async (req, res, next) => {
  try {
    const [events] = await Event.fetchActive();
    res.status(200).json({ events });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createEvent = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(422).json({
      message: firstError ? firstError.msg : 'Validation failed',
      field: firstError ? firstError.path : null
    });
  }

  try {
    const eventDetails = {
      user_id: Number(req.body.user_id),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      event_date: req.body.event_date,
      image_url: req.body.image_url,
      status: req.body.status || 'active'
    };

    const [result] = await Event.save(eventDetails);

    res.status(201).json({
      message: 'Event uploaded successfully',
      eventId: result.insertId
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

