var gulpConfig = function() {
  var db_file ='db.js',
      db_json ='db.json';

  return {
    port: 7000,
    db_file: db_file,
    db_json: db_json,
    db_scripts:{
      src: [db_file, './src/**/*.+(js|json)']
    }
  }
};

module.exports = gulpConfig();