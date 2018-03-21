const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: "YOUR_MONGO_DB_URL", 
    secret: crypto,
    db: "task-for-uk-schools"
}