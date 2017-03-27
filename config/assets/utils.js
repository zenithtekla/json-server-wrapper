'use strict';

let fs    = require('fs'),
  path    = require('path'),
  _       = require('lodash'),
  glob    = require('glob');

  let utils = {
  getDirectories: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },
  getJSFiles: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return (file.indexOf(".") !== 0) && (file.indexOf("js") !== 0);
    });
  },
  getFiles: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return (file.indexOf(".") !== 0) && (file.indexOf("compiled") === -1);
    });
  },
  getAppsDir: function (srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
      return file!=="core" && file!=="user"
        && fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },
  getModelsDir: function (srcpath) {
    return fs
      .readdirSync(srcpath)
      .filter(function(file) {
        return file==='models'
          && fs.statSync(path.join(srcpath, file)).isDirectory();
      });
  },
  getGlobbedPaths: function (globPatterns, excludes) {
    // URL paths regex
    let urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

    // The output array
    let output = [];

    // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
      globPatterns.forEach(function (globPattern) {
        output = _.union(output, getGlobbedPaths(globPattern, excludes));
      });
    } else if (_.isString(globPatterns)) {
      if (urlRegex.test(globPatterns)) {
        output.push(globPatterns);
      } else {
        let files = glob.sync(globPatterns);
        if (excludes) {
          files = files.map(function (file) {
            if (_.isArray(excludes)) {
              for (let i in excludes) {
                if (excludes.hasOwnProperty(i)) {
                  file = file.replace(excludes[i], '');
                }
              }
            } else {
              file = file.replace(excludes, '');
            }
            return file;
          });
        }
        output = _.union(output, files);
      }
    }

    return output;
  },
  JSONstringify: function(data) {
    return JSON.stringify(data, null, 4);
  },
  exportJSON: function (data, outputFile, time) {
    time = time || '';
    fs.writeFile(outputFile, JSON.stringify(data, null, 4),
      function(err) {
        if(err) {
          console.log('ERROR ', err);
        } else {
          console.log(time, 'JSON saved to', outputFile);
        }
      }
    );
  },
  exportFile: function (data, outputFile) {
    fs.writeFile(outputFile, data,
      function(err) {
        if(err) {
          console.log('ERROR ', err);
        } else {
          console.log('Data saved to ' + outputFile);
        }
      }
    );
  },
  checkFile: function(filePath, onSuccess, onError){
    fs.stat(filePath, function (err, stat) {
      if(err == null) {
        // console.log('File ', filePath, ' exists');
        if(onSuccess) onSuccess();
      } else if(err.code == 'ENOENT') {
        // file does not exist
        if(onError) onError();
        // fs.writeFile('log.txt', 'Some log\n');
      } else {
        console.log('Some other error: ', err.code);
      }
    })
  },
  readFile: function (filePath, type, callback) {
    type = type || 'utf8';
    fs.readFile(path, type, function(error, data) {
      if (err) console.log("ERROR reading file ", outputFile, ", message ", err.message);
      else if(callback) callback();
    });
  },
  writeFile: function(data, outputFile, type){
    type = type || 'utf8'; // 'ascii', 'utf8', 'base64'
    fs.writeFile(outputFile, data, type, function (err) {
       if (err) console.log("ERROR writing to ", outputFile, ", message ", err.message);
    });
  },
  expandFile: function (data, outputFile) {
    fs.appendFile(outputFile, data, function (err) {
      if (err) throw err;
      else {
        // console.log('Data saved to ' + outputFile);
      }
    });
  },

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  buffer2base64String: function(bufferArray){
    return String.fromCharCode(...new Uint8Array(bufferArray));
  }
};

utils.appendFile = function (data, outputFile) {
  utils.checkFile(outputFile, function(){
    utils.expandFile(data, outputFile);
  }, function(){
    utils.writeFile(data, outputFile);
  });
};

utils.appendJSON = function (data, jsonFile, raw) {
  raw = raw || 'utf8';
  fs.readFile(jsonFile, raw, function (err, fileContent) {
    if (err) throw err;
    else {
      if (fileContent)
        fileContent = JSON.parse(fileContent);
      utils.exportJSON(_.merge(data, fileContent),jsonFile);
    }
  });
};

// http://code.runnable.com/VbK5NWjuHQI-PLsX/find-delete-files-for-node-js-glob-and-fs
utils.deleteFile = function (filePath, callback){
  utils.checkFile(filePath, function(){
    fs.unlink(filePath, callback);
    console.log(filePath + " deleted");
  }, function(){
    console.log(filePath + " none-existent");
  });
};

utils.overwriteJSON= function(data, outputFile, time) {
  return fs.writeFile(outputFile,'[]', () => utils.exportJSON(data,outputFile, time));
}

export default utils;

String.prototype.re = function(pattern){
  pattern = (typeof pattern ==='string') ? new RegExp(pattern) : pattern;
  return pattern.test(this);
};
