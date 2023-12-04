import {comparePassword, hashPassword} from "../../src/utils/hashPassword";

describe('Функция хеширования пароля', () => {
    const salt = 'some_rand_string'
    const password = 'some_hard_password'

    it('должна возвращать один и тот же хеш при одних и тех же значениях аргументов', () => {
        const firstHash = hashPassword(password, salt);
        const secondHash = hashPassword(password, salt);

        expect(firstHash).toBe(secondHash)
    })

    it('должна возвращаить разный хеш при разных значениях аргументов', () => {
        const firstHash = hashPassword(password + '1', salt);
        const secondHash = hashPassword(password + '2', salt);

        expect(firstHash).not.toBe(secondHash)
    })

    it('сопостовление должно вернуть истину при тех же значениях аргументов', () => {
        const hashedPassword = hashPassword(password, salt)

        expect(comparePassword(hashedPassword, password, salt)).toBe(true)
    })

    it('сопостовление должно вернуть ложь при разных значениях аргументов', () => {
        const hashedPassword = hashPassword(password + '1', salt)

        expect(comparePassword(hashedPassword, password + '2', salt)).toBe(false)
    })
})