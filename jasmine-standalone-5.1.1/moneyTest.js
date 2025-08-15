import {formatCurrencyCents} from '../scripts/utils/money.js'

describe('test suite: formatCurrencyCents', () => {
    it('converts cents into dollars', () =>{
        expect(formatCurrencyCents(2095)).toEqual('20.95');
    });
    it('works with 0', () =>{
        expect(formatCurrencyCents(0)).toEqual('0.00');
    });
    it('rounds up to the neares cent', () =>{
        expect(formatCurrencyCents(2000.5)).toEqual('20.01');
    });
});