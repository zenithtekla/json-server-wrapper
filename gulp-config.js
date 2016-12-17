var gulpConfig = function() {
	var db_file ='db.js';

  return {
  	db_file: db_file,
    db_scripts:{
      src: [db_file]
    }
  }
};

module.exports = gulpConfig();