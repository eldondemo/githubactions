const _ = require('lodash');

function greet(name) {
  return _.capitalize(name) + ', welcome to the GitHub Actions workshop!';
}

module.exports = { greet };
