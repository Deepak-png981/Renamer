## [1.5.1](https://github.com/Deepak-png981/Renamer/compare/v1.5.0...v1.5.1) (2024-10-11)


### Bug Fixes

* Introduced TSX file renaming. ([4290d07](https://github.com/Deepak-png981/Renamer/commit/4290d070ce3de0f43a596e3d624e233f6606a06a))

# [1.5.0](https://github.com/Deepak-png981/Renamer/compare/v1.4.0...v1.5.0) (2024-10-11)


### Features

* Introduced jsx renaming to the CLI ([35bf66d](https://github.com/Deepak-png981/Renamer/commit/35bf66dafbaec8408255e589d53a47b2dae150cd))

# [1.4.0](https://github.com/Deepak-png981/Renamer/compare/v1.3.0...v1.4.0) (2024-10-11)


### Features

* Introduced JavaScript file renaming to the CLI. ([14cacae](https://github.com/Deepak-png981/Renamer/commit/14cacae7db2afd228cf163bfa04dbd8e1a475f06))

# [1.3.0](https://github.com/Deepak-png981/Renamer/compare/v1.2.1...v1.3.0) (2024-10-07)


### Bug Fixes

* utils.spec.ts ([db3ed51](https://github.com/Deepak-png981/Renamer/commit/db3ed51ff317ad2aa267faf577f4e95ceaa73306))


### Features

* Introduced Typescript file renaming ([035a0c2](https://github.com/Deepak-png981/Renamer/commit/035a0c2821b2d4a5992f8bb7bffa18108774eed7))

## [1.2.1](https://github.com/Deepak-png981/Renamer/compare/v1.2.0...v1.2.1) (2024-10-07)


### Bug Fixes

* Implemented max file name length ([d0e7da6](https://github.com/Deepak-png981/Renamer/commit/d0e7da64bb8d6873eb7f95d295cb41a78860863d))

# [1.2.0](https://github.com/Deepak-png981/Renamer/compare/v1.1.2...v1.2.0) (2024-10-06)


### Features

* Introduced naming conventions. ([7839203](https://github.com/Deepak-png981/Renamer/commit/783920328b4faf627ddc4d66f95b8ecf4317e218))

## [1.1.2](https://github.com/Deepak-png981/Renamer/compare/v1.1.1...v1.1.2) (2024-09-29)


### Bug Fixes

* check absolute path for JSON ([8a51c74](https://github.com/Deepak-png981/Renamer/commit/8a51c744a761e598782508dd49b637d7428e9ce1))

## [1.1.1](https://github.com/Deepak-png981/Renamer/compare/v1.1.0...v1.1.1) (2024-09-28)


### Bug Fixes

* Triggering Binary release ([586f3e8](https://github.com/Deepak-png981/Renamer/commit/586f3e8359186d46ebf8b1d4e806a73ab92051a8))

# [1.1.0](https://github.com/Deepak-png981/Renamer/compare/v1.0.3...v1.1.0) (2024-09-27)


### Features

* Introduced releasing JSON file as output from the Renamer-CLI ([a828caf](https://github.com/Deepak-png981/Renamer/commit/a828cafc9ee400d9c663564bb61da993aa329834))

## [1.0.3](https://github.com/Deepak-png981/Renamer/compare/v1.0.2...v1.0.3) (2024-09-22)


### Bug Fixes

* updated the binaries bin name. ([83a2283](https://github.com/Deepak-png981/Renamer/commit/83a2283a7b7a65d10641c4413698a0133ebbfc7e))

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
