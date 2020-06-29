// External Dependencies
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const historySchema = new mongoose.Schema({
	createdAt: Date,
	cardId: String,
	loginDate: String,
	logoutDate: String,
	isLogged: false,
	ownerId: ObjectId,
});

module.exports = mongoose.model('History', historySchema);
