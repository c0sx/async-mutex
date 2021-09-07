import { runExclusively } from "../src/mutex";

describe('async mutex', () => {
    async function someExclusiveFunc(id: number) {
        return new Promise<number>(resolve => {
            setTimeout(() => {
                resolve(id);
            }, Math.random() * 1000);
        });
    }

    it('should run async functions sequentially', async () => {
        const sequence = [1, 2, 3, 4, 5];

        const result: number[] = [];
        await Promise.all(sequence.map(one => {
            return runExclusively(someExclusiveFunc.bind(this, one))
                .then(id => result.push(id))
        }));

        sequence.forEach((value, index) => {
            expect(value).toEqual(result[index]);
        });
    });
});
