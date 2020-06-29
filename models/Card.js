// External Dependencies
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
	ownerName: { type: String },
	cardId: { type: String, unique: true }
});

module.exports = mongoose.model('Card', cardSchema);
