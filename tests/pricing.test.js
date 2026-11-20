const { calculateQuote, MINIMUM_CHARGE } = require('../src/pricing');

describe('calculateQuote', () => {
  test('multiplies the service rate by square footage', () => {
    const quote = calculateQuote('pressure-washing', 1000);
    expect(quote.total).toBe(300);
  });

  test('applies the minimum charge on small jobs', () => {
    const quote = calculateQuote('window-cleaning', 100);
    expect(quote.total).toBe(MINIMUM_CHARGE);
  });

  test('rounds to cents', () => {
    const quote = calculateQuote('house-soft-wash', 1234.567);
    expect(quote.total).toBe(308.64);
  });

  test('rejects an unknown service', () => {
    expect(() => calculateQuote('roof-repair', 500)).toThrow('Unknown service');
  });

  test.each([0, -50, 25000, NaN])('rejects invalid square footage %p', (sqft) => {
    expect(() => calculateQuote('pressure-washing', sqft)).toThrow('squareFeet');
  });
});