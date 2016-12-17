var gulpConfig = function() {
	var db_file ='db.js';

  return {
  	db_file: db_file,
    db_scripts:{
      src: [db_file]
    },
    nodemonOptions: {
      script: 'server.js',
      delayTime: 50,
      // socket may be optional
      watch: ['db.js', 'server.js']
    }
  }
};

module.exports = gulpConfig();