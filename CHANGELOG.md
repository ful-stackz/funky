# funky/changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Missing in-code docs for
  - `some()`
  - `none()`
  - `isSome()`
  - `isNone()`
  - `ok()`
  - `err()`
  - `isOk()`
  - `isErr()`
  - `isArray()`
  - `Option`
  - `Result`

## [0.3.1] - 07/06/2020

### Added

- `Option<T>.map` function with unit tests and docs
- `Option<T>.or` function with unit tests and docs
- `Option<T>.and` function with unit tests and docs
- `Option<T>.andThen` function with unit tests and docs
- `Result<T, E>.map` function with unit tests and docs
- `Result<T, E>.andThen` function with unit tests and docs
- `Result<T, E>.orElse` function with unit tests and docs
- Add in-code docs for Option, Result and utils
- Add link to doc.deno.land for browsing the documentation generated from the code

### Updated

- Acknowledge the deprecation notice of @usefultools/monads and update the
mention to point to @hqoss/monads instead

## [0.3.0] - 27/05/2020

### Added

- New utility functions along with tests and docs
  - `isArrayOf`
  - `isArrayEmpty`
  - `isString`
  - `isNumber`
  
### Fixed

- Typos and outdated information in `lib/utils/README.md`

## [0.2.0] - 27/05/2020

- Improved `Option<T>`, `OptionSome<T>` and `OptionNone<T>` interfaces
- Improved `Result<T, E>`, `ResultOk<T, E>` and `ResultErr<T, E>` interfaces

## [0.1.0] - 26/05/2020

### Added

- `Option<T>` type and tests
- `Result<T, E>` type and tests
- `funky/utils` and tests
