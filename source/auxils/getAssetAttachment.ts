import Discord from "discord.js"
import { getTimer, hasTimer } from "../getTimer"
import assets from "../systems/assets"

export = (asset_name: string): Discord.MessageAttachment => {
	// Check flavour assets
	if (hasTimer()) {
		const flavour = getTimer().game.getGameFlavour()

		if (flavour) {
			const swaps = flavour["asset_swaps"]
			for (let i = 0; i < swaps.length; i++) {
				if (swaps[i].from === asset_name) {
					const attachment = new Discord.MessageAttachment(flavour.assets[swaps[i].to], swaps[i].to)
					return attachment
				}
			}
		}
	}

	const attachment = new Discord.MessageAttachment(assets[asset_name], asset_name)
	return attachment
}
