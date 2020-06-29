const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

router.post('/', (req, res) => {
	var cardId = req.body.cardId;
	Card.findOne({ cardId }).then((user) => {
		if (user) {
			res.send('Bu kart zaten kayıtlı.');
		} else {
			const newCard = new Card({
				ownerName: req.body.ownerName,
				cardId: req.body.cardId
			});
			newCard
				.save()
				.then((user) => {
					res.send('Kartınızın kaydı başarıyla alınmıştır');
				})
				.catch((err) => console.log(err));
		}
	});
});

router.get('/', (req, res) => {
	Card.find({}, function(err, cards) {
		var cardMap = {};

		cards.forEach(function(card) {
			cardMap[card._id] = card;
		});
		res.send(cards);
	});
});

module.exports = router;
