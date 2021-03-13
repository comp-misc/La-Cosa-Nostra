import packageJson from "../package.json"
import semver from "semver"

export interface Version {
	major: number
	minor: number
	rev: number
	updateName: string
	homepage: string
	version: string
}

const version: Version = {
	major: semver.major(packageJson.version),
	minor: semver.minor(packageJson.version),
	rev: semver.patch(packageJson.version),
	updateName: packageJson["update-name"],
	homepage: packageJson.homepage,
	version: packageJson.version,
}

export default version
