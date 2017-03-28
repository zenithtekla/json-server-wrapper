import faker from 'faker';
import utils from './config/assets/utils';
import _ from 'lodash';
const ownerGroupId = faker.random.uuid();
const adminGroupId = faker.random.uuid();
const devGroupId = faker.random.uuid();
const techGroupId = faker.random.uuid();

module.exports = function(time) {
  /*
  * GROUPS
  * Same preset-Groups: Administrator, Developer, Tech Support,... can be created with no users, then provide UI to add/remove users to the groups.
  *
  * ACL:
  *   Owner {RoleId: 1x}
  *     can view, reply, edit, and delete all Emails including Comments.
  *     can view, edit, add, and delete Groups members
  *     can delete the Groups entirely
  *
  *   Administrator {RoleId: 2x}
  *     can view, reply, edit, and delete all Emails including Comments.
  *     can view, edit, add, and delete Groups members
  *     can delete the Groups entirely
  *
  *   Developer {RoleId: 3x}
  *     can view, reply, edit, and delete Comments.
  *     can view, edit, add, and delete Groups members
  *
  *   Tech Support {RoleId: 4x}
  *     can view, reply, edit and delete lastest 3 Comments.
  *     can view Groups members
  *
  *   General Users - open to public, rather than locking down to system users - the general public does not require a Group and role
  *     can view, reply, edit and delete last Comment.
  *     can view Groups members.
  *
  * USERS
  * User can be created without having a specified Group.
  * User can participate many Groups
  *
  *
  * Email is a thread containing Replies (Comments)
  *
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
    /*

    // loading JSON and segregated programmable js files for data can be done as follow
    fruits: require('./src/json/food.json').fruits,
    getAllLibs: require('./src/scripts/appstore/Libraries/getAllLibs'),

    */
    Users: [],

    // seed some groups
    Groups: [
      generateGroup(ownerGroupId, 'Owner', 10),
      generateGroup(adminGroupId, 'Administrator', 20),
      generateGroup(devGroupId, 'Developer', 30),
      generateGroup(techGroupId,'Tech support', 40)
    ]
  };

  // seed more users
  _.times(10, () => data.Users.push(generateUser(data.Groups)));

  // seed Recipients
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
      SentDate: faker.date.past(),
      Comments: []
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

function generateGroup (groupId, groupName, roleId) {
  return {
    _id: groupId,
    Name: groupName,
    Description: `${groupName} role in the Email System`,
    Role: roleId, // owner role 1
    Users: []
  }
}

function generateUser(groups){
  let Name = faker.internet.userName(),
    _id = faker.random.uuid(),
    FullName = faker.name.findName(),
    Email = `${Name}@${faker.internet.email().split('@')[1]}`,
    Title = faker.name.jobTitle(),
    Company = faker.company.companyName();

  // assigning _id for new user

  return {
    _id,
    Name,
    Email,
    FullName,
    Title,
    Company,
    Groups: addGroup(groups, {_id, Name, Email, FullName, Title, Company})
  }
}

function addGroup(groups, userObj) {
  let n = _.random(0,3); // maximum participation of 3 groups
  if (n === 0) return [];

  let groupSet = [], uniqueSet = [];
  _.times(n, () => {
    let m = _.random(0,3);
    if(!_.includes(uniqueSet, m)){
      uniqueSet.push(m);
      groups[m].Users.push(userObj);
      groupSet.push(groups[m]);
    }
  });

  return groupSet;
}