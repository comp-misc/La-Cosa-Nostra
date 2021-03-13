import reader from "../systems/__reader"
import auxils from "../systems/auxils"
import expansions from "../systems/expansions"

import sarcasm from "./rolesystem_misc/sarcasm"

import addModule from "./rolesystem_modular/addModule"
import attributeDecrement from "./rolesystem_modular/attributeDecrement"
import clearModuleActions from "./rolesystem_modular/clearModuleActions"
import hasModule from "./rolesystem_modular/hasModule"
import logSuccess from "./rolesystem_modular/logSuccess"
import predefineLogs from "./rolesystem_modular/predefineLogs"

import attacked from "./rolesystem_protocol/attacked"

import basicAttack from "./rolesystem_prototypes/basicAttack"
import basicDefense from "./rolesystem_prototypes/basicDefense"
import basicHide from "./rolesystem_prototypes/basicHide"
import basicKidnap from "./rolesystem_prototypes/basicKidnap"
import powerfulAttack from "./rolesystem_prototypes/powerfulAttack"
import powerfulDefense from "./rolesystem_prototypes/powerfulDefense"
import removePoison from "./rolesystem_prototypes/removePoison"
import unstoppableAttack from "./rolesystem_prototypes/unstoppableAttack"
import unstoppableDefense from "./rolesystem_prototypes/unstoppableDefense"
import unstoppableKidnap from "./rolesystem_prototypes/unstoppableKidnap"

let rolesystem = {
	misc: {
		sarcasm,
	},
	modular: {
		addModule,
		attributeDecrement,
		clearModuleActions,
		hasModule,
		logSuccess,
		predefineLogs,
	},
	protocol: {
		attacked,
	},
	prototypes: {
		basicAttack,
		basicDefense,
		basicHide,
		basicKidnap,
		powerfulAttack,
		powerfulDefense,
		removePoison,
		unstoppableAttack,
		unstoppableDefense,
		unstoppableKidnap,
	},
}

expansions.forEach((expansion) => {
	const directory = expansion.expansion_directory + "/rolesystem/"
	const expansion_rolesystem = reader("rolesystem_", directory)

	if (!expansion_rolesystem) {
		return
	}

	// Concatenate
	rolesystem = auxils.objectOverride(rolesystem, expansion_rolesystem)
})

export = rolesystem
