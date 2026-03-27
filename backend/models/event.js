const db = require('../util/database');

module.exports = class Event {
  static save(event) {
    return db.execute(
      `INSERT INTO events
      (user_id, title, description, category, location, event_date, image_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event.user_id,
        event.title,
        event.description,
        event.category || null,
        event.location || null,
        event.event_date,
        event.image_url || null,
        event.status || 'active'
      ]
    );
  }

  static fetchActive() {
    return db.execute(
      `SELECT id, user_id, title, description, category, location, event_date, image_url, status, created_at
       FROM events
       WHERE status = 'active'
       ORDER BY event_date ASC`
    );
  }
};

