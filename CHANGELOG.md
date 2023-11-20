# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning].

This change log follows the format documented in [Keep a CHANGELOG].

[semantic versioning]: http://semver.org/
[keep a changelog]: http://keepachangelog.com/

## v1.5.0 - 2023-11-20

### Added

- Added types for payment's `status` and `error_code`: `Paddle.PaymentStatus` and `Paddle.PaymentErrorCode` correspondingly.

## v1.4.1 - 2023-11-17

### Fixed

- Moved the `payments` property in the `Transaction` type from `details` to the root level where it is supposed to be.p

## v1.4.0 - 2023-11-17

### Changed

- `customData` is now not required in the checkout props when using `transactionId` as it must be already attached to the transaction.

### Added

- Added missing `transaction.paid` event to the webhooks.

## v1.3.0 - 2023-11-16

### Changed

- Improved web portion types, making checkout methods closer to the actual API:
  - At least on item is required when `items` is passed.
  - Made `customer` optional.
  - Made `quantity` optional (it defaults to `1`).

### Fixed

- Fixed TypeScript errors on `Paddle.Checkout.open`.

## v1.2.0 - 2023-11-09

### Added

- Added the ability to pass a function that returns the key as the key argument to `client`. This allows the use of Google Cloud Secrets and calling `client` on the module level where the secrets aren't defined in `process`.

## v1.1.0 - 2023-11-05

### Fixed

- `previewPrices` success response now correctly doesn't include pagination information.

### Changed

- Reorganized custom data types to share between API and web modules. If you used `PaddleAPI` and see a missing type, use the `Paddle` namespace instead.

- `Transaction` and `Subscription` custom data should now overlap. Fields that do not overlap should be optional. It's dictated by the web's custom data-assigning to relevant transaction and subscription simultaneously. Creating an API or web client with incompatible custom data definitions will result in the client function returning `never`.

### Added

- Added web portion of Paddle Billing platform that allows working with Paddle from the browser, i.e., open checkout. Use `loadScript` to load and use the web API. [See README for more information](#web).

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
