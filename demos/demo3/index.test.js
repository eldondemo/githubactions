const { greet } = require('./index');

test('greet capitalizes name', () => {
  expect(greet('alice')).toBe('Alice, welcome to the GitHub Actions workshop!');
});

test('greet handles already capitalized name', () => {
  expect(greet('Bob')).toBe('Bob, welcome to the GitHub Actions workshop!');
});
