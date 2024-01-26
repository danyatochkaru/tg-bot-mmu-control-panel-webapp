export type SpecialityCodes = '03' | '04' | '05' | '06'

export const SPECIALITY_NAMES_BY_CODE: Record<SpecialityCodes, string> = {
    '03': 'Бакалавриат',
    '04': 'Магистратура',
    '05': 'Специалитет',
    '06': 'Аспирантура',
}