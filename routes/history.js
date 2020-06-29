const express = require('express');
const router = express.Router();
const History = require('../models/History');
const Card = require('../models/Card');
const date = require('date-and-time');

router.post('/', (req, res) => {
	const { cardId } = req.body;
	const now = new Date();
	const dateNow = date.format(now, 'DD/MM/YYYY HH:mm:ss');

	History.findOne({ cardId })
		.sort({ createdAt: -1 })
		.then((history) => {
			Card.findOne({ cardId }).then((card) => {
				console.log(`History: ${history}`);
				console.log(`Card: ${card}`);
				if (card) {
					if (history === null) {
						const newHistory = new History({
							createdAt: new Date(),
							cardId,
							isLogged: true,
							loginDate: dateNow,
							ownerId: card.id,
						});

						newHistory
							.save()
							.then((user) => {
								res.send('Yeni kayıt alındı');
							})
							.catch((err) => console.log(err));
					} else if (history) {
						console.log('Giriş durumu: ');
						console.log(history.isLogged);
						if (history.isLogged === true) {
							history.logoutDate = dateNow;
							history.isLogged = false;
							history
								.save()
								.then((user) => {
									res.send('Çıkış kaydınız alındı');
								})
								.catch((err) => console.log(err));
						} else {
							const newHistory = new History({
								createdAt: new Date(),
								cardId,
								isLogged: true,
								loginDate: dateNow,
								ownerId: card.id,
							});

							newHistory
								.save()
								.then((user) => {
									res.send('Giriş kaydınız alındı');
								})
								.catch((err) => console.log(err));
						}
					}
				} else
					res.send(
						'Bu işlem için önce kartınızın sistemde kayıtlı olması gerekmektedir'
					);
			});
		});
});

router.get('/', (req, res) => {
	History.find({}, function (err, histories) {
		var historyMap = {};

		histories.forEach(function (history) {
			historyMap[history._id] = history;
		});
		res.send(histories);
	});
});
module.exports = router;
