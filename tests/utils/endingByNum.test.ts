import endingByNum from "../../src/utils/endingByNum";

describe('Окончание слов за счёт числа перед ними', () => {
    const words: [string, string, string] = ['яблоко', 'яблока', 'яблок']

    it('должна обрабатывать базовые числа', () => {
        expect(endingByNum(1, words)).toBe('яблоко')
        expect(endingByNum(2, words)).toBe('яблока')
        expect(endingByNum(5, words)).toBe('яблок')
    })

    it('должна обрабатывать отрицательные числа', () => {
        expect(endingByNum(-1, words)).toBe('яблоко')
        expect(endingByNum(-2, words)).toBe('яблока')
        expect(endingByNum(-5, words)).toBe('яблок')
    })
})