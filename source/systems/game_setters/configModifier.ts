import { LcnConfig } from "../../LcnConfig"
import expansions from "../expansions"

const configModifier = (config: LcnConfig): LcnConfig => {
	// Per MDN documentation
	const new_config = JSON.parse(JSON.stringify(config)) as LcnConfig
	let playing = new_config.playing

	// Expansions
	for (let i = expansions.length - 1; i >= 0; i--) {
		const game_assign = expansions[i].scripts.game_assign
		if (!game_assign) {
			continue
		}

		playing = game_assign(playing) || playing
		break
	}

	// Enforce defaults on parameters if undefined
	const enforce_default = [
		{ key: "players", liberal: false },
		{ key: "roles", liberal: true },
		{ key: "expansions", liberal: false },
		{ key: "shuffle", liberal: false },
		{ key: "flavour", liberal: true },
	]
	const unsafePlaying = playing as Record<string, any>
	const unsafeNewPlaying = new_config.playing as Record<string, any>

	for (let i = 0; i < enforce_default.length; i++) {
		const enforce = enforce_default[i]
		if (enforce.liberal) {
			unsafePlaying[enforce.key] = unsafeNewPlaying[enforce.key] || unsafePlaying[enforce.key]
		} else {
			unsafePlaying[enforce.key] = unsafeNewPlaying[enforce.key]
		}
	}

	new_config["playing"] = playing

	return new_config
}

export = configModifier
