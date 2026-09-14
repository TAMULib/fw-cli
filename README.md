# fw-cli

The **FOLIO Workflow Command Line Interface**.

This is a helper script for creating, running, and deleting workflows.


## Getting Started
```
yarn install
yarn build
yarn link

fw
```


## Important Settings

These are some configuration settings with special meaning that are managed directly by `fw-cli`.

| Setting               | Description
| --------------------- | -----------
| `cliAccess`           | For CLI only; Used to toggle between the `gateway` **URL** and the `direct` **URL** (`direct` is generally a local `mod-workflow` instance).
| `cliAutoRefresh`      | For CLI only; Used to enable/disable attempting to auto-refresh a logged in account if the refresh token exists when necessary.
| `cliDirectUrl`        | For CLI only; The **URL** to use when `cliAccess` is set to `direct`.
| `cliFolioLoginPath`   | For CLI only; The login path to use (`/authn/login-with-expiry`).
| `cliFolioPass`        | For CLI only; The pass to use for logging into the gateway.
| `cliFolioRefreshPath` | For CLI only; The login path to use (`/authn/refresh`).
| `cliFolioTenant`      | For CLI only; The `tenant` to use for logging into or interacting with the gateway.
| `cliFolioUser`        | For CLI only; The user name to use for logging into the gateway.
| `cliGatewayUrl`       | For CLI only; The **URL** to use when `cliAccess` is set to `gateway`.
| `cliWd`               | For CLI only; The working directory that contains the `fw-registry` files (usually either `./fw-registry/` or `./fw-registry/examples`.
| `folioPass`           | (deprecated, use **FolioRequestTask** instead of **RequestTask** and this is not needed) The pass to use for logging into the gateway in a built node.
| `folioUser`           | (deprecated, use **FolioRequestTask** instead of **RequestTask** and this is not needed) The user name to use for logging into the gateway in a built node.
| `gatewayUrl`          | The gateway **URL** that gets embedded into each built node.


The following are now `cache` rather than `config`.

| Setting                | Description
| ---------------------- | -----------
| `cliFolioAccessToken`  | For CLI only; The `folioAccessToken` cookie value.
| `cliFolioRefreshToken` | For CLI only; The `folioRefreshToken` cookie value.
| `cliFolioToken`        | For CLI only; The `folioAccessToken` as the `token` **HTTP** header value, for compatibility purposes.
| `cliUserId`            | For CLI only; The **User ID** retrieved from the last `user` command call.


### Checksum Support

This supports build time checksum that represent the configuration used during the build.
Most, but not all, configuration fields are used to generate a checksum.
This allows for verifying that the current configuration exactly matches.

The current configuration checksum may be printed using the `-S` or `--checksum` parameter.

The following configuration fields are excluded when building the checksum:
  - `cliAccess`
  - `cliAutoRefresh`
  - `cliDirectUrl`
  - `cliFolioLoginPath`
  - `cliFolioPass`
  - `cliFolioRefreshPath`
  - `cliFolioTenant`
  - `cliFolioUser`
  - `cliGatewayUrl`
  - `cliWd`


### Git Hash Support

A **Git** hash may be automatically appended onto **Workflow** versions when building.
This functionality is not enabled by default and requires the `-g` or `--git` parameter to be passed.


## Running mock FOLIO

Provides mock `/authn/login-with-expiry` and `/user-import`.

```
yarn gateway
```
