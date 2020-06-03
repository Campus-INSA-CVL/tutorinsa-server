<img src="./logo_tutorinsa.png" alt="Tutorinsa logo" style="display: block; margin: auto;">

# API TutorINSA

> A RESTful API for the TutorINSA's application !

## Start the server

### Requirement

This project need, to run correctly:

- [nodejs](https://nodejs.org/en/)
- [mongodb server](https://www.mongodb.com/try/download/community)

### Configuration

You can change database, test and default in the config file (a .env will be used in the futur)

### Install the dependancies

```bash
# install the dependancies
npm install
```

### Start the server

```bash
# strart the server in development mode
npm run dev
# strart the server in production mode
npm run start
```

### Populate the database

```bash
# add data to a database
npm run populatedb mongodb://localhost:27017/name_of_your_local_db
```

## Documentation

Available at [localhost:3030/docs]() after starting the server

## Questions

## Issues

## Contributing

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
