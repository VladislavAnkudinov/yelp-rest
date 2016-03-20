console.log('job!');
if (module.parent) {
  console.log('job has parent');
} else {
  console.log('job no parent');
}
var srv = require('./');

