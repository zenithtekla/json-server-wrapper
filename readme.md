*FEATURE*

- `json-server-wrapper` can be used to provide JSON RESTful API and mock back-end data dynamically and programmatically.

- `faker` repo to dynamically create data dumps for the json-server.

- rebuild, update|restart server on change of `db.json` and `db.js`. Manually making direct changes to `db.json` are accepted.

- `db.js` is a singleton to load data dynamically and programmatically.

- log different versions of json data in folder `db_log/*.json`, for review.

*INSTRUCTION*

v0.0.6

- `npm install` at first to kickstart the download of app dependencies.

- Gulp orchestrator as a pre-requisite: `npm i -g gulp gulp-cli`

- Currently, there are 3 ways to kickstart the json-server:


		1) In terminal, write `gulp nodemon`

		2) use the `app` file (similar to `gulp nodemon`). Ensure permissions to execute the app file (`chmod a+x app`, `chmod 777 app`), then execute `./app` or `. app` in the terminal (for Linux|Mac users) and Windows terminal (Git BASH|mintty|cygwin).

		3) Manually open 2 cli and run `gulp shell` and `gulp watch` per each.

- make changes to `db.js` file to have more routes. Changes can be made to `db.json` manually.
- Ensure permissions to write files within NodeJS env so the app can update the `db.json` automatically on changing of `db.js`

*INHERITANCE*

- NodeJS fs module and utils methods ( e.g. exportJSON) to work with file as did in the [NESA1](https://github.com/zetekla/ng1-nesa-front) and [NESA2](https://github.com/zenithtekla/node-express-sequelize-ng2/commits/nesa2.0.0) repos.

- Gulp tasks.

*CREDIT*:
- to the `json-server` and `faker` teams.