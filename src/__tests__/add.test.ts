import { addOne } from '../add';

describe('first test', () => {
  it('should add one 1 + 1 = 2', () => {
    expect(addOne(1)).toBe(2);
  });
});
