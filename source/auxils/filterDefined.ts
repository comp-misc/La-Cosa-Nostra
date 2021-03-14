const filterDefined = <T>(data: (T | undefined)[]): T[] => data.filter((x) => x !== undefined) as T[]

export = filterDefined
