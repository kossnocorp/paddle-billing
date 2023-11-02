# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning].

This change log follows the format documented in [Keep a CHANGELOG].

[semantic versioning]: http://semver.org/
[keep a changelog]: http://keepachangelog.com/

## v1.0.0 - 2023-11-02

### Changed

- **BREAKING**: `parseWebhookBody` now expects a client instance (created with `client` function) or `null` as the first argument so that the `Event` that is returned from the function has the correct custom data types inferred.

### Added

- Added `custom_data` field to `Customer`, `Address` and `Business`.

- `client` now accepts `Customer`, `Address` and `Business` properties in the generic argument.

## v0.2.1 - 2023-10-12

### Fixed

- Fixed `current_billing_period` field in `Subscription`. Now it's `TimePeriod`.

## v0.2.0 - 2023-09-19

Initial release
