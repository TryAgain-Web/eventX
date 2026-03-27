const { validationResult } = require('express-validator');

const User = require('../models/user');

function parseSocialLinks(value) {
  if (value == null) return null;

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (typeof value === 'object') {
    return value;
  }

  return null;
}

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const [rows] = await User.findById(userId);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.socialLinks = parseSocialLinks(user.socialLinks);
    res.status(200).json(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(422).json({
      message: firstError ? firstError.msg : 'Validation failed',
      field: firstError ? firstError.path : null
    });
  }

  try {
    const userId = req.params.id;
    const username = (req.body.username || '').trim();
    const bio = req.body.bio ?? null;
    const profilePicture = req.body.profilePicture ?? null;

    const socialLinks = req.body.socialLinks ?? null;

    const [conflicts] = await User.findByUsernameExcludingId(username, userId);
    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Username already exists', field: 'username' });
    }

    const socialLinksJson = socialLinks ? JSON.stringify(socialLinks) : null;

    await User.updateProfileById(userId, {
      username,
      bio,
      profilePicture,
      socialLinks: socialLinksJson
    });

    const [rows] = await User.findById(userId);
    const updated = rows[0];

    if (!updated) {
      return res.status(404).json({ message: 'User not found after update' });
    }

    updated.socialLinks = parseSocialLinks(updated.socialLinks);
    res.status(200).json(updated);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

