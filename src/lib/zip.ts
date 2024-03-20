export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
    if (arr1.length !== arr2.length) {
        throw new Error('Arrays do not have the same length.');
    }
    return arr1.map((item, index) => [item, arr2[index]] as [T, U]);
}
