type objectFields = string
type objectValues = any

export default function getUniqueValuesArray<T = Record<objectFields, objectValues>>(array: T[], field: keyof T): T[keyof T][] {
    return array
        .map(i => i[field])
        .filter((x, i, a) => a.indexOf(x) === i)
}
