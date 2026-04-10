const { formatName, buildGreeting } = require('./index');

test('formatName capitalizes both names', () => {
  expect(formatName('jane', 'doe')).toBe('Jane Doe');
});

test('formatName handles already capitalized', () => {
  expect(formatName('Jane', 'Doe')).toBe('Jane Doe');
});

test('buildGreeting returns full welcome message', () => {
  expect(buildGreeting('john', 'smith')).toBe('Welcome, John Smith!');
});
