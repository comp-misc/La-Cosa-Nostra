interface PermissionsArray {
	allow: string[]
	deny: string[]
}

export default (permissions: Record<string, boolean>): PermissionsArray => {
	const keys = Object.keys(permissions)

	const ret: PermissionsArray = {
		allow: [],
		deny: [],
	}

	for (let i = 0; i < keys.length; i++) {
		if (permissions[keys[i]] === true) {
			ret.allow.push(keys[i])
		} else if (permissions[keys[i]] === false) {
			ret.deny.push(keys[i])
		}
	}
	return ret
}
