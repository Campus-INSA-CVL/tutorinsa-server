<p align="center"><img src="./tutorinsa.png" alt="Tutorinsa logo" align="center" style="width:320px"></p><br/>
<p align="center">
  <a href="https://github.com/Campus-INSA-CVL/tutorinsa-server/workflows/CI/badge.svg">
    <img src="https://github.com/Campus-INSA-CVL/tutorinsa-server/workflows/CI/badge.svg" alt="tests status" />
  </a>
  <a href="https://dev.azure.com/esoubiran25/tutorinsa-server/_build/latest?definitionId=26&branchName=master">
    <img src="https://dev.azure.com/esoubiran25/tutorinsa-server/_apis/build/status/Campus-INSA-CVL.tutorinsa-server?branchName=master&jobName=Job" alt="Build Status" />
  </a>
</p>
 
# API TutorINSA

> A RESTful API for the TutorINSA's application !

## Start the server

### Requirement

This project need, to run correctly:

- [Node.js](https://nodejs.org/en/)
- [Mongodb server](https://www.mongodb.com/try/download/community)

### Configuration

You can change the development database in the "config/default.json" at the "mongodb" field.
You have to create a ".env" file using the ".local.env" as a pattern, and fill it. ".env" is used for production. In development, some generic settings are provided, but can be change in "config/default.json". "config/production.json" will merge and overwrite settings from "config/default.json".

### Install the dependencies

```bash
# install the dependencies
npm install
```

### Start the server

You be able to send mail, you have to create a `.env` file and add _SMTP_ keys from `.local.env`. Mailer actually uses Gmail, and the password must be an [App Password](https://myaccount.google.com/apppasswords)

```bash
# start the server in development mode
npm run dev
# start the server in production mode
npm run start
```

### Populate the database

```bash
# add data to a database
npm run populatedb mongodb://localhost:27017/name_of_your_local_db
```

## Documentation

Available at [localhost:3030/docs](localhost:3030/docs) after starting the server

## Contributing [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Campus-INSA-CVL/tutorinsa-server/issues)

Feel free to help us ! Use [issues](https://github.com/Campus-INSA-CVL/tutorinsa-server/issues) and [pull requests](https://github.com/Campus-INSA-CVL/tutorinsa-server/pulls) !

## Lint & Test

```bash
# check syntax of the code
npm run lint
# fix small issues
npm run lint -- --fix
```

```bash
# execute all tests
npm run jest
# compile code and execute all tests
npm run test
```

## Licence

Copyright (c) Forever and Ever, or at least the current year.

Licensed under the [MIT license](https://github.com/Campus-INSA-CVL/tutorinsa-server/blob/dev/LICENSE).
