import { faker } from '@faker-js/faker';

export default function createUniqueName(prefix?: string) {
    if (prefix) {
        return `${prefix} ${faker.string.alphanumeric(10)}`
    } else {
        return `${faker.animal} ${faker.string.alphanumeric(10)}`
    }
}