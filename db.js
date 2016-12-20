var faker = require('faker')

module.exports = function(time) {
  var utils = require('./config/assets/utils')

  var headers = {
    Accept: "application/json, text/plain, */*",
    token: "AQIC5wM2LY4SfcxgJlbzdqId154xIqeSMyrJ0RrxgZuo6ag.*AAJTSQACMDIAAlNLABQtMTIwNjMzNDgzMjc3MDc4MzQ3NgACUzEAAjAx*"
  };

  var logon = {
    "apiErrorModel": null,
    "success": true,
    "apiVersion": "0.9.10",
    "hasNotification": true,
    "defaultUserAppTypeId": 1,
    "defaultUserLibTypeId": 1,
    "userId": "775b44ae-d59d-414c-82fe-a907debf6874",
    "name": "zetekla2",
    "session": {
    "token": "AQIC5wM2LY4SfczBEfYBdZ8vIW6lqWsx9YWpRjw5ABR1qc8.*AAJTSQACMDIAAlNLABM1OTg1Mjk5Nzc0NDg3OTkyNjc4AAJTMQACMDE.*",
      "expiresIn": 60
    }
  };

  var data = {
    headers: headers,
    logon: logon,
    fruits: require('./src/json/food.json').fruits,
    getAllLibs: require('./src/scripts/appstore/Libraries/getAllLibs'),
    users: ['Pristine', 'Phuc', 'Kallio', 'Tran', 'Aubrey'],
    movies: [{id:1, title: 'spider man'}, {id:2, title: 'spider man2'}],
    "posts": [
      { "id": 1, "title": "json-server", "author": "typicode" },
      { "id": 2, "title": "fake", "author": "I dont know" }
    ],
    customers: generateCustomers()
  };

  // programmatically create 12 users
  for (var i = 0; i < 12; i++) {
      data.users.push({ id: i, name: 'user' + i })
  }

  /*
  var moment          = require('moment')
  var bundleHash      = moment().format('YYYY-MM-DD-HH-mm-ss')
  utils.exportJSON(data,'./db_log/'+bundleHash+'-db.json')
  */
  return utils.exportJSON(data, './db.json', time);
};


function generateCustomers () {
  var customers = []

  for (var id = 0; id < 5; id++) {
    var firstName   = faker.name.firstName()
    var lastName    = faker.name.firstName()
    var phoneNumber = faker.phone.phoneNumberFormat()

    customers.push({
      "id": id,
      "first_name": firstName,
      "last_name": lastName,
      "phone": phoneNumber
    })
  }

  return customers;
}