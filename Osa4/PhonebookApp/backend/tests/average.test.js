const { test, describe } = require('node:test');
const assert = require('node:assert');
const { average } = require('../utils/for_testing');

describe('average', () => {
  test('of an array with one value is the value itself', () => {
    assert.strictEqual(average([1]), 1);
  });

  test('of an array with multiple values is calculated correctly', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5);
  });

  test('of an empty array is zero', () => {
    assert.strictEqual(average([]), 0);
  });
});
