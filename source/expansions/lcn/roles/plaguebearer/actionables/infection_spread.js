module.exports = function (actionable, game, params) {
	game.addAction("plaguebearer/infect_plague", ["retrocycle"], {
		from: actionable.from,
		to: params.visitor,
		expiry: 1,
		tags: ["permanent"],
		priority: 10,
	})
}
