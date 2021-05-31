import { getTimer, hasTimer } from "../getTimer"
import assets from "../systems/assets"

export interface FileAsset {
	name: string
	data: Buffer
}

export default (asset_name: string): FileAsset => {
	//Delay import to avoid circular imports

	// Check flavour assets
	if (hasTimer()) {
		const flavour = getTimer().game.getGameFlavour()

		if (flavour) {
			const swaps = flavour.asset_swaps
			for (let i = 0; i < swaps.length; i++) {
				if (swaps[i].from === asset_name) {
					if (!flavour.assets[swaps[i].to]) {
						throw new Error("Unable to find asset '" + swaps[i].to + "'")
					}
					return {
						data: flavour.assets[swaps[i].to],
						name: swaps[i].to,
					}
				}
			}
		}
	}
	if (!assets[asset_name]) {
		throw new Error("Unable to find asset '" + asset_name + "'")
	}
	return {
		data: assets[asset_name],
		name: asset_name,
	}
}
