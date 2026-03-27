const db = require('../util/database');

module.exports = class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static findByEmail(email) {
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    static save(user) {
        return db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [user.username, user.email, user.password]
        );
    }

    static findById(id) {
        return db.execute(
            'SELECT id, username, email, bio, profilePicture, socialLinks FROM users WHERE id = ?',
            [id]
        );
    }

    static findByUsernameExcludingId(username, excludingId) {
        return db.execute(
            'SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1',
            [username, excludingId]
        );
    }

    static updateProfileById(id, { username, bio, profilePicture, socialLinks }) {
        return db.execute(
            'UPDATE users SET username = ?, bio = ?, profilePicture = ?, socialLinks = ? WHERE id = ?',
            [username, bio, profilePicture, socialLinks, id]
        );
    }
};
