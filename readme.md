*INSTRUCTION*

v0.0.4
- `npm install` at first to kickstart the download of app dependencies.

- Gulp orchestrator as a re-prequisite: `npm i -g gulp gulp-cli`

- Ensure permissions to execute the app file (`chmod a+x app`, `chmod 777 app`), then execute `./app` in the terminal (for Linux|Mac users) and Windows terminal (Git BASH|mintty|cygwin).

- make changes to db.js and its dependency files to have more routes.

- tested with Gulp tasks and gulp-nodemon is able to launch the json-server correctly.

- Automated with Gulp tasks. Watch and automatically rebuild JSON file. Export JSON files for logging information to db_log folder.
That enables reviews of data changes.

- Require fs and export JSON file as did in the NESA1 and NESA2 repos.
- Hook the live JSON file to json-server instead of db.js file as in v0.0.1