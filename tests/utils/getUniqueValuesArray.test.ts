import getUniqueValuesArray from "../../src/utils/getUniqueValuesArray";

describe('Получение массива уникальных значений из свойства объектов', () => {
    const list = [
        {value: 'Москва'},
        {value: 'Омск'},
        {value: 'Анапа'},
        {value: 'Москва'},
        {value: 'Архангельск'},
        {value: 'Омск'},
    ]

    it('не должна мутировать исходный массив', () => {
        const initList = [...list];

        getUniqueValuesArray(initList, 'value')

        expect(initList).toEqual(list)
    })

    it('должна вернуть массив без повторяющихся значений', () => {
        expect(getUniqueValuesArray(list, 'value')).toEqual(['Москва', 'Омск', 'Анапа', 'Архангельск'])
    })
})