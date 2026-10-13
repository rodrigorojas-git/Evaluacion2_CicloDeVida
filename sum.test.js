const sum = require('./sum');

describe('sum', () => {
  test('suma 1 + 2 y da 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

  test('suma numeros negativos', () => {
    expect(sum(-1, -2)).toBe(-3);
  });
});
