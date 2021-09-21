import { RoleDescriptor } from "../../../../role"
import AlignmentDisguise, { Config } from "../alignment_disguise"

export default class GodFather extends AlignmentDisguise {
	constructor(config: Config = { alignmentInvestigation: "Town" }) {
		super(config)
	}

	override formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = "Godfather"
		super.formatDescriptor(descriptor)
	}
}
