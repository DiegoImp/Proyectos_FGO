import { capitalizeWords } from '../../static/js/utils/format.js';

describe('Utils: Format', () => {
    describe('capitalizeWords(str)', () => {
        const testCases = [
            { input: 'hello world', expected: 'Hello World', desc: 'should capitalize multiple words' },
            { input: 'servant', expected: 'Servant', desc: 'should capitalize single word' },
            { input: '', expected: '', desc: 'should handle empty string' },
            { input: 'Artoria Pendragon', expected: 'Artoria Pendragon', desc: 'should keep already capitalized words' }
        ];

        testCases.forEach(({ input, expected, desc }) => {
            it(`${desc} [Input: "${input}" -> Expected: "${expected}"]`, () => {
                expect(capitalizeWords(input)).to.equal(expected);
            });
        });
    });
});
