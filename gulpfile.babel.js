'use strict';

import gulp             from 'gulp';
import _                from 'lodash';
import path             from 'path';

// dependencies
import config           from './gulp-config';
import buildJSON        from './db'; // loading db.js

// bash, server script
import shell            from 'gulp-shell';
import nodemon          from 'gulp-nodemon';
import runSequence      from 'run-sequence';
import { spawn }        from 'child_process';
import clean            from 'gulp-clean';
import cache            from 'gulp-cached';

// utils
import rename           from 'gulp-rename';
import moment           from 'moment';

let bundleHash = moment().format('YYYY-MM-DD-HH-mm-ss')
let i = 0

gulp.task('default', ['serve']);

gulp.task('serve', function (callback) {
  runSequence('build:json', 'log:json', 'watch:src', 'watch:json', 'shell', callback);
});

gulp.task('watch', ['watch:src', 'watch:json'])

gulp.task('watch:json', function(done){
  return gulp.watch([config.db_json], ['log:json']);
});

gulp.task('copy', function(done){
  gulp.src('./db_log/db.js', {read:false}).pipe(clean());

  return gulp.src(config.db_scripts.src)
      .pipe(gulp.dest('./db_log/'));
});

gulp.task('build:new', function(done){
  return require('./db_log/db.js')(bundleHash);
});

gulp.task('watch:src', function(done){
  return gulp.watch(config.db_scripts.src, ['copy'], function(done){
    return require('./db_log/db')(bundleHash);
  });
});

gulp.task('watch:js', function(){
  return gulp.watch(config.db_scripts.src, ['build:json']);
});

/*gulp.watch('path to watch', function(event){
  if(event.type === 'changed') {
    gulp.start('your:task');
  }
};*/

gulp.task('shell', shell.task(['json-server -w db.json --port 7000']));
// gulp.task('shell', ['watch_src'], shell.task(['nodemon node_modules/json-server/bin db.json --port 7000']));

gulp.task('dev', function(callback) {
  runSequence('build:json', 'log:json', 'nodemon', callback);
});

// clearAll cache
gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

/*
STRATEGY 1: `gulp nodemon` is enough to kickstart the server
  pipe nodemon with inner watch, per watch condition, execute either build:json or log:json
*/

gulp.task('build:json', function(done){
  i++;
  console.log('execute build:json ', i);
  return buildJSON(bundleHash);
  // return shell.task(['json-server -w db.json --port 7000']);
});

gulp.task('log:json', function(done){
  return gulp.src(config.db_json)
          .pipe(rename({basename: bundleHash+'-db'}))
          .pipe(gulp.dest('./db_log/'));
});


gulp.task('nodemon', function (cb) {
  var started = false;
  // Start the server at the beginning of the task
  return nodemon({
      script: 'server.js',
      delayTime: 50,
      ignore: ['node_modules/'],
      // socket may be optional
      watch: ['db.js', 'server.js', 'db.json'],
      // tasks: ['build:json']
      tasks: function(changedFiles){
        var tasks = [];
        console.log(changedFiles);
        if (!changedFiles) return tasks;
        changedFiles.forEach(function(file){
          // if(_.includes(file, 'db.js') && !~tasks.indexOf('build:json')) tasks.push('build:json')
          // if(_.includes(file, 'db.json') && !~tasks.indexOf('log:json')) tasks.push('log:json')
          if(path.extname(file) === '.js' && !~tasks.indexOf('build:json')) tasks.push('build:json')
          if(path.extname(file) === '.json' && !~tasks.indexOf('log:json')) tasks.push('log:json')
        })
        return tasks;
      }
    })
    .on('start', function () {
      if (!started) {
        started = true;
        cb();
      }
      // console.log('Restarting server ...');
    })
    .on('restart', function () {
      console.log(bundleHash, 'restarting the json-server');
      // shell.task(['json-server --watch ${config.db_file} --port 7000']);
    });
});