## [1.0.2](https://github.com/Deepak-png981/Renamer/compare/v1.0.1...v1.0.2) (2024-09-22)


### Bug Fixes

* keeping the windows binaries for now only. ([60443e4](https://github.com/Deepak-png981/Renamer/commit/60443e485f658e14bc1507965e016b94c0eae4d8))

## [1.0.1](https://github.com/Deepak-png981/Renamer/compare/v1.0.0...v1.0.1) (2024-09-22)


### Bug Fixes

* updated the release pipelines to include the macos, linux and windows binaries. ([1599812](https://github.com/Deepak-png981/Renamer/commit/1599812c38e2fe7de5d7eb10d51e625c30e6e2e6))

# 1.0.0 (2024-09-22)


### Bug Fixes

* handled environment variables of OPENAI_API_KEY to be passed in easily ([de2de50](https://github.com/Deepak-png981/Renamer/commit/de2de5022335a11c962d979007ffdb2e7c69c682))
* improved to use Promise.allSettled instead of using Promis.all ([820e979](https://github.com/Deepak-png981/Renamer/commit/820e979b1c91218646ee38a74ff97f233dfd4e01))
* releaserc.json ([7459f0a](https://github.com/Deepak-png981/Renamer/commit/7459f0a4d738f2a751c57c38a98da8380573b596))
* removed caching for now ([c881e71](https://github.com/Deepak-png981/Renamer/commit/c881e715113d5e6e5f7365591e4651842efe56ad))
* splitted the processFile function and then added the test cases ([7234e29](https://github.com/Deepak-png981/Renamer/commit/7234e29fabffa6b5789faf73ba2ea2cbd5187b49))
* updatd the stat , error.stack ([ea439ef](https://github.com/Deepak-png981/Renamer/commit/ea439ef61fe517c0ece16da2f5c486ac74122fd0))
* updated errrorHandler to throw the complete error instead of error.stack ([e4825b4](https://github.com/Deepak-png981/Renamer/commit/e4825b40dece6caaaf7f70706448fc8871453e6f))
* updated the CHANGELOG.md ([2472bb5](https://github.com/Deepak-png981/Renamer/commit/2472bb5edee31444ee950c4bafe4c9c708352b17))
* updated the URLs and logger. ([58687e2](https://github.com/Deepak-png981/Renamer/commit/58687e21ea6b5c25b53e25def559f664dc463b36))


### Features

* Added Binary release. ([d8becfd](https://github.com/Deepak-png981/Renamer/commit/d8becfdd59eb0f3140006865dcbfe9acefef115f))
* Added github actions test pipeline. ([b9547cb](https://github.com/Deepak-png981/Renamer/commit/b9547cb38a969249859a17a4b6e250fba7eba4c0))
* added Logger and done some refractoring of the code. ([9cb71a2](https://github.com/Deepak-png981/Renamer/commit/9cb71a208232a2e7f7af07e40bc1dae6c41b82ae))
* Added support for Markdown files. ([b749cde](https://github.com/Deepak-png981/Renamer/commit/b749cdeb0cdacf44417085ff70eb252845c44922))
* Introduced jest , wrote e2e test case and some unit test cases for utils functions ([a0e3061](https://github.com/Deepak-png981/Renamer/commit/a0e306153ad8873a103c4124e3c1980e5397311a))
* OpenAI rename .txt feature ([c5b73d7](https://github.com/Deepak-png981/Renamer/commit/c5b73d7f862841664cf9ce346c034b1a501e8062))
* refractored the code. ([28b4678](https://github.com/Deepak-png981/Renamer/commit/28b467842119dd70ce22b96a358525a995e5ab76))
* updated the semantic release configuration ([f42d081](https://github.com/Deepak-png981/Renamer/commit/f42d081ec5bbde187760f331b7b42491c05a8f3e))

# Change log

## 1.3.0 (22-09-2024)

- Added binary release pipeline.

## 1.2.0 (14/09/2024)

- Added support for markdown files.
- Refractored the codebase to improve readability and maintainability.

## 1.1.0 (13/09/2024)

- Added github actions for CI.

## 1.0.0 (12/09/2024)

- Initial development introduced text file renamer along with unit tests and E2E tests.
