import Discord from "discord.js"
import { getTimer, hasTimer } from "../getTimer"

export default (asset_name: string): Discord.MessageAttachment => {
	//Delay import to avoid circular imports
	const assets = require("../systems/assets")

	// Check flavour assets
	if (hasTimer()) {
		const flavour = getTimer().game.getGameFlavour()

		if (flavour) {
			const swaps = flavour["asset_swaps"]
			for (let i = 0; i < swaps.length; i++) {
				if (swaps[i].from === asset_name) {
					return new Discord.MessageAttachment(flavour.assets[swaps[i].to], swaps[i].to)
				}
			}
		}
	}
	return new Discord.MessageAttachment(assets[asset_name], asset_name)
}
