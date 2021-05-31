import { LcnConfig, PlayingConfig } from "../../LcnConfig"
import expansions from "../../expansions"

const configModifier = (config: LcnConfig): LcnConfig => {
	// Per MDN documentation
	const new_config = JSON.parse(JSON.stringify(config)) as LcnConfig
	let newPlaying = JSON.parse(JSON.stringify(config.playing)) as PlayingConfig

	// Expansions
	for (let i = expansions.length - 1; i >= 0; i--) {
		const game_assign = expansions[i].scripts.game_assign
		if (!game_assign) {
			continue
		}
		newPlaying = game_assign(newPlaying) || newPlaying
	}

	// Enforce defaults on parameters if undefined
	const enforce_default: { key: keyof PlayingConfig; liberal: boolean }[] = [
		{ key: "players", liberal: false },
		{ key: "roles", liberal: true },
		{ key: "expansions", liberal: false },
		{ key: "shuffle", liberal: false },
		{ key: "flavour", liberal: true },
	]

	const updateValue = <K extends keyof PlayingConfig>(key: K, liberal: boolean): void => {
		const oldValue: PlayingConfig[K] = new_config.playing[key]
		if (liberal) {
			const newValue: PlayingConfig[K] = newPlaying[key]
			newPlaying[key] = newValue === undefined ? oldValue : newValue
		} else {
			newPlaying[key] = oldValue
		}
	}

	for (const { key, liberal } of enforce_default) {
		updateValue<typeof key>(key, liberal)
	}
	new_config.playing = newPlaying
	return new_config
}

export default configModifier
