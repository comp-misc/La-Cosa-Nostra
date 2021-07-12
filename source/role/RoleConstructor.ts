import { RolePart } from "./RolePart"

export interface RoleConstructor<R extends RolePart<T, S>, T, S> {
	new (config: T, state: S): R
}
