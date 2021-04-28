const logger = require('../logger');

exports.findById = function (id, cb) {

  process.nextTick(function () {
    var idx = id - 1;
    if (userRecords[idx]) {
      cb(null, userRecords[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}
exports.findByUsername = function (username) {

  const user = userRecords.find(r => r.username === username);
  // because the store is currently just an array of JS objects, we have
  // to clone the object here, or run the risk of permanently and unintentionally
  // modifying the source record (e.g., by sanitizing the password from it, thereby
  // making subsequent authentication attempts fail)
  if (user) {
    return Object.assign({}, user);
  } else {
    return undefined;
  }
}
exports.getSubscriptionsForUser = function (username) {
  const user = userRecords.find(r => r.username === username);
  return user ? user.subscriptions : [];
}

var userRecords = [
  {
    id: 1,
    username: 'awr',
    password: 'secret',
    displayName: 'Amalia',
    emails: []
  },
  {
    id: 2,
    username: 'rw',
    password: 'secret',
    displayName: 'Rick',
    emails: [{value: 'rick@walters.xyz'}]
  }
];
