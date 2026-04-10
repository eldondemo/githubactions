const _ = require('lodash');

function formatName(first, last) {
  return _.capitalize(first) + ' ' + _.capitalize(last);
}

function buildGreeting(first, last) {
  return 'Welcome, ' + formatName(first, last) + '!';
}

module.exports = { formatName, buildGreeting };
