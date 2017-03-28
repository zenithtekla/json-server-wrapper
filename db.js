import faker from 'faker';
import utils from './config/assets/utils';
import {numberOfUsers, numberOfEmails, numberOfChildComments, hasComment} from './src/scripts/config/configuration';
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
  * TODOS:
  *   - ENSURE Users - EmailIds and CommentIds pertaining to them for ACCESSIBILITY & INBOX
  *   - TOKEN, generating, Expiring, access control
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
    ],
    RegisteredUsers: [] // RegisteredUsers is a set of emails of users who had been assigned a unique user id in the Email System.
  };

  /* seed more users*/
  _.times(numberOfUsers, () => data.Users.push(generateUser(data.Groups)));

  const generateEmail = function(int, counter){
    let _id = faker.random.uuid(),
      Subject = faker.lorem.sentence(),
      ToRecipients = generateRecipients(),
      Comments = [];

    if(hasComment){
      const SUBJECT = `RE: ${Subject}`;
      let Comment1 = generateComment(_id, SUBJECT, ToRecipients);
      Comments.push(Comment1);
      if(numberOfChildComments>1){
        let subj = 'RE:';
        _.times(numberOfChildComments-1, () => Comments.push(generateComment(_id, subj+SUBJECT, generateRecipients(), Comment1.ParentId, Comment1.ParentSlug)))
      }

      let Comment2 = generateComment(_id, SUBJECT, ToRecipients);
      Comments.push(Comment2);
      if(numberOfChildComments>1){
        let subj = 'RE:';
        _.times(numberOfChildComments-1, () => Comments.push(generateComment(_id, subj+SUBJECT, generateRecipients(), Comment2.ParentId, Comment2.ParentSlug)))
      }
    }

    return {
      _id,
      counter,
      Subject,
      Body: faker.lorem.sentences(),
      ToRecipients,
      Sender: {
        Id: data.Users[int]._id,
        Email: data.Users[int].Email,
        Name: data.Users[int].Name,
        FullName: data.Users[int].FullName,
        Title: data.Users[int].Title
      },
      SentDate: faker.date.past(),
      Comments
    }
  };

  const generateEmails = () => {
    let Emails = [], counter = 0;
    _.times(numberOfEmails, () => {
      counter++;
      Emails.push(generateEmail(_.random(0,numberOfUsers-1), counter))
    });
    return Emails;
  };

  data.Emails = [...generateEmails()]; // simulate Schema assignment in MongoDB

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
      Company = faker.company.companyName(),
      Phone = faker.phone.phoneNumber();

    if(!_(data.RegisteredUsers).map('Email').includes(Email))
      data.RegisteredUsers.push({_id, Name, Email, FullName, Phone});

    // assigning _id for new user

    return {
      _id,
      Name,
      Email,
      FullName,
      Title,
      Company,
      Phone,
      Groups: [...addGroup(groups, {_id, Name, Email, FullName, Phone})]
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

  function generateComment(EmailId, EmailSubject, previousRecipientsList, ParentId, ParentSlug) {
    let CurrentSlug = faker.lorem.slug();
    /* Sender should be part of the RegisteredUsers,
       If not, prompt to signup on login or automatically sign them up through Outlook emailing plugin and assign them a uuid.
       Thus, they should always be a registered user.
     */
    let sample, idx = -1;
    do {
      sample = _.sample(previousRecipientsList);
      idx = _(data.RegisteredUsers).findIndex({Email: sample});
    }
    while (idx===-1);

    let comment = {
      DiscussionId: EmailId,
      ParentId: ParentId || faker.random.uuid(),
      CurrentSlug,
      ParentSlug: ParentSlug || CurrentSlug,
      FullSlug: ParentSlug ? `${ParentSlug}/${CurrentSlug}` : CurrentSlug,
      Subject: EmailSubject || faker.lorem.sentence(),
      Body: faker.lorem.sentences(), // Body of the Comment NOT entire everything
      Sender: data.RegisteredUsers[idx],
      ToRecipients:[generateRecipients()]
    };
    return comment;
  }

  // seed Recipients
  function generateRecipients() {
    // get some register users randomly
    let Recipients = [..._.sampleSize(_(data.RegisteredUsers).map('Email').value(), _.random(2,5))];

    // outsider user emails
    _.times(_.random(1,5), function () {
      Recipients.push(faker.internet.email());
    });
    return Recipients;
  }

  /*
  let moment          = require('moment')
  let bundleHash      = moment().format('YYYY-MM-DD-HH-mm-ss')
  utils.exportJSON(data,'./db_log/'+bundleHash+'-db.json')
  */
  return utils.exportJSON(data, './db.json', time);
};




