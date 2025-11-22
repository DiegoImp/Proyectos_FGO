import { getAscensionLevel, getScrollClass } from '../../static/js/ui/cards.js';

describe('UI: Cards Logic', () => {
    describe('getAscensionLevel(rarity, level)', () => {
        const testCases = [
            { rarity: 5, level: 1, expected: 0, desc: 'Level 1 (Rarity 5)' },
            { rarity: 5, level: 90, expected: 4, desc: 'Max Level (Rarity 5)' },
            { rarity: 5, level: 50, expected: 0, desc: 'Cap 1 Boundary (50)' },
            { rarity: 5, level: 51, expected: 1, desc: 'Cap 1 Exceeded (51)' },
            { rarity: 5, level: 60, expected: 1, desc: 'Cap 2 Boundary (60)' },
            { rarity: 5, level: 61, expected: 2, desc: 'Cap 2 Exceeded (61)' },
            { rarity: 4, level: 40, expected: 0, desc: 'Rarity 4 Cap 1 Boundary (40)' },
            { rarity: 4, level: 41, expected: 1, desc: 'Rarity 4 Cap 1 Exceeded (41)' }
        ];

        testCases.forEach(({ rarity, level, expected, desc }) => {
            it(`${desc} [Input: (${rarity}, ${level}) -> Expected: ${expected}]`, () => {
                expect(getAscensionLevel(rarity, level)).to.equal(expected);
            });
        });
    });

    describe('getScrollClass(textWidth, containerWidth)', () => {
        const testCases = [
            { text: 100, container: 200, expected: '', desc: 'Fits perfectly' },
            { text: 150, container: 100, expected: 'scroll_short', desc: 'Small overflow (50%)' },
            { text: 400, container: 100, expected: 'scroll_extreme', desc: 'Huge overflow (300%)' }
        ];

        testCases.forEach(({ text, container, expected, desc }) => {
            it(`${desc} [Input: (${text}, ${container}) -> Expected: "${expected}"]`, () => {
                expect(getScrollClass(text, container)).to.equal(expected);
            });
        });
    });
});
