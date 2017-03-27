let faker = require('faker')
import utils from './config/assets/utils';
import _ from 'lodash';
const groupId = faker.random.uuid();

module.exports = function(time) {
  /*
  * Same preset-Groups: Administrator, Stakeholder, ... can be created with no users, then provide UI to add users
  * Similarly: User can be created without having a specified Group. Group can be added later.
  * Emails with no Replies (Comments), Emails with Replies.
  * */

  let headers = {
    Accept: "application/json, text/plain, */*",
    token: "AQIC5wM2LY4SfcxgJlbzdqId154xIqeSMyrJ0RrxgZuo6ag.*AAJTSQACMDIAAlNLABQtMTIwNjMzNDgzMjc3MDc4MzQ3NgACUzEAAjAx*"
  };

  let logon = {
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

  let data = {
    // headers: headers,
    logon: logon,
    /*fruits: require('./src/json/food.json').fruits,
    getAllLibs: require('./src/scripts/appstore/Libraries/getAllLibs'),
    users: ['Pristine', 'Phuc', 'Kallio', 'Tran', 'Aubrey'],
    movies: [{id:1, title: 'spider man'}, {id:2, title: 'spider man2'}],
    "posts": [
      { "id": 1, "title": "json-server", "author": "typicode" },
      { "id": 2, "title": "fake", "author": "Matthew Bergman & Marak Squires" }
    ],*/
    Customers: generateCustomers(),
    Users: [generateUsers(), generateUsers(), generateUsers()]
  };

   const generateGroup = function() {
    return {
      _id: groupId,
      Name: 'Administrator',
      Description: 'Admin group can oversee everything',
      Role: 2, // owner role 1
      Users: [data.Users[0]._id, data.Users[1]._id, data.Users[2]._id]
    }
  };

   data.Groups = [generateGroup()];

/*  new Schema({
    Subject: { type: String, trim: true },
    Body: { type: String, trim: true },
    ToRecipients: [],
    Sender: {
      Id: User._id,
      Email: User.Email,
      Name: User.Name,
      FullName: User.FullName,
      Title: User.Title,
    },
    SentDate: Date,
    Comments: [Comment]

  });*/
  const generateRecipients = () => {
    let Recipients = [];
    _.times(_.random(1,8), ()=>Recipients.push(faker.internet.email()));
    return Recipients;
  };

  const generateEmail = function(int){
    return {
      Subject: faker.lorem.sentence(),
      Body: faker.lorem.sentences(),
      ToRecipients: generateRecipients(),
      Sender: {
        Id: data.Users[int]._id,
        Email: data.Users[int].Email,
        Name: data.Users[int].Name,
        FullName: data.Users[int].FullName,
        Title: data.Users[int].Title
      },
      SentDate: faker.date.past()
    }
  };

  data.Emails = [
    generateEmail(0),generateEmail(0),
    generateEmail(1),generateEmail(1), generateEmail(1),
    generateEmail(2), generateEmail(2)
  ];
  /*// programmatically create 12 users
  for (let i = 0; i < 12; i++) {
      data.users.push({ id: i, name: 'user' + i })
  }*/

  /*
  let moment          = require('moment')
  let bundleHash      = moment().format('YYYY-MM-DD-HH-mm-ss')
  utils.exportJSON(data,'./db_log/'+bundleHash+'-db.json')
  */
  return utils.exportJSON(data, './db.json', time);
};

function generateUsers(){
  let name = faker.internet.userName();
  return {
    _id: faker.random.uuid(),
    Name: name,
    Email: `${name}@gmail.com`,
    FullName: faker.name.firstName(),
    Title: faker.name.jobTitle(),
    Company: faker.company.companyName(),
    Groups: [groupId]
  }
}

function generateCustomers () {
  let customers = []

  for (let id = 0; id < 5; id++) {
    let firstName   = faker.name.firstName()
    let lastName    = faker.name.firstName()
    let phoneNumber = faker.phone.phoneNumberFormat()

    customers.push({
      "id": id,
      "first_name": firstName,
      "last_name": lastName,
      "phone": phoneNumber
    })
  }

  return customers;
}