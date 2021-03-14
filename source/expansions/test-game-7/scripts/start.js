var fs = require("fs")
var mafia = require("../../../lcn")

module.exports = function (config) {
	// Override configuration liberally
	var override = JSON.parse(fs.readFileSync(__dirname + "/override.json"))
	return mafia.auxils.objectOverride(config, override)
}