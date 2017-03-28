import _ from 'lodash';
const numberOfChildComments = _.random(0,3);

export default {
  numberOfUsers: 10,
  numberOfEmails: 152,
  numberOfChildComments, // = number of comments = number of comments to comments
  hasComment: numberOfChildComments > 0
}