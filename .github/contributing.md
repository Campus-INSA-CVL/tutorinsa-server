# Contributing to TutorINSA, an association of Campus INSA Centre-Val de Loire

Thank you for contributing to TutorINSA, an association of Campus INSA Centre-Val de Loire! :heart: :tada:

This repo is where most issues are reported for the server of TutorINSA. Campus INSA CVL embraces modularity and is broken up across many repos.

## Report a bug

Before creating an issue please make sure you have checked out the docs. You might want to also try searching Github. It's pretty likely someone has already asked a similar question.

If you haven't found your answer please feel free to create an issue on Github.

Issues can be reported in the [issue tracker](https://github.com/Campus-INSA-CVL/tutorinsa-server/issues).

## Report a Security Concern

We take security very seriously at Campus INSA CVL. We welcome any peer review of our 100% open source code to ensure nobody's Campus INSA CVL app is ever compromised or hacked. As a web application developer you are responsible for any security breaches. We do our very best to make sure Campus INSA CVL is as secure as possible by default.

In order to give the community time to respond and upgrade we strongly urge you report all security issues to us. Send one of the core team members a PM using the [campus page on facebook](https://www.facebook.com/campusinsacvl) or email us at `webmaster@bde.insa-cvl.fr` with details and we will respond ASAP.

## Pull Requests

We :heart: pull requests and we're continually working to make it as easy as possible for people to contribute.

We prefer small pull requests with minimal code changes. The smaller they are the easier they are to review and merge. A core team member will pick up your PR and review it as soon as they can. They may ask for changes or reject your pull request. This is not a reflection of you as an engineer or a person. Please accept feedback graciously as we will also try to be sensitive when providing it.

Although we generally accept many PRs they can be rejected for many reasons. We will be as transparent as possible but it may simply be that you do not have the same context or information regarding the roadmap that the core team members have. We value the time you take to put together any contributions so we pledge to always be respectful of that time and will try to be as open as possible so that you don't waste it. :smile:

**All PRs (except documentation) should be accompanied with tests and pass the linting rules.**

### Code style

Before running the tests from the `test/` folder `npm test` will run ESlint. You can check your code changes individually by running `npm run lint`.

### ES6 compilation

This reposetorie uses [TypeScript](https://www.typescriptlang.org/) to leverage the latest developments of the JavaScript language. All code and samples are currently written in ES2018. To transpile the code in this repository run.

> npm run compile

**Note:** `npm test` will run the compilation automatically before the tests.

### Tests

[Jest](https://jestjs.io/) tests are located in the `test/` folder and can be run using the `npm run jest` or `npm test` (with ESLint and code coverage) command.

## Contributor Code of Conduct

As contributors and maintainers of this project, we pledge to respect all people who contribute through reporting issues, posting feature requests, updating documentation, submitting pull requests or patches, and other activities.

We are committed to making participation in this project a harassment-free experience for everyone, regardless of level of experience, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, or religion.

Examples of unacceptable behavior by participants include the use of sexual language or imagery, derogatory comments or personal attacks, trolling, public or private harassment, insults, or other unprofessional conduct.

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct. Project maintainers who do not follow the Code of Conduct may be removed from the project team.

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by opening an issue or contacting one or more of the project maintainers.

This Code of Conduct is adapted from the [Contributor Covenant](http://contributor-covenant.org), version 1.0.0, available at [http://contributor-covenant.org/version/1/0/0/](http://contributor-covenant.org/version/1/0/0/)
