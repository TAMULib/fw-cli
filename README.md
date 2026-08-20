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

| Setting                | Description
| ---------------------- | -----------
| `cliAccess`            | For CLI only; Used to toggle between the `gateway` **URL** and the `direct` **URL** (`direct` is generally a local `mod-workflow` instance).
| `cliDirectUrl`         | For CLI only; The **URL** to use when `cliAccess` is set to `direct`.
| `cliFolioAccessToken`  | For CLI only; The `folioAccessToken` cookie value.
| `cliFolioLoginPath`    | For CLI only; The login path to use (`/authn/login-with-expiry`).
| `cliFolioPass`         | For CLI only; The pass to use for logging into the gateway.
| `cliFolioRefreshToken` | For CLI only; The `folioRefreshToken` cookie value.
| `cliFolioTenant`       | For CLI only; The `tenant` to use for logging into or interacting with the gateway.
| `cliFolioToken`        | For CLI only; The `folioAccessToken` as the `token` **HTTP** header value, for compatibility purposes.
| `cliFolioUser`         | For CLI only; The user name to use for logging into the gateway.
| `cliGatewayUrl`        | For CLI only; The **URL** to use when `cliAccess` is set to `gateway`.
| `cliUserId`            | For CLI only; The **User ID** retrieved from the last `user` command call.
| `cliWd`                | For CLI only; The working directory that contains the `fw-registry` files (usually either `./fw-registry/` or `./fw-registry/examples`.
| `folioPass`            | (deprecated, use **FolioRequestTask** instead of **RequestTask** and this is not needed) The pass to use for logging into the gateway in a built node.
| `folioUser`            | (deprecated, use **FolioRequestTask** instead of **RequestTask** and this is not needed) The user name to use for logging into the gateway in a built node.
| `gatewayUrl`           | The gateway **URL** that gets embedded into each built node.


### Checksum Support

This supports build time checksum that represent the configuration used during the build.
Most, but not all, configuration fields are used to generate a checksum.
This allows for verifying that the current configuration exactly matches.

The current configuration checksum may be printed using the `-S` or `--checksum` parameter.

The following configuration fields are excluded when building the checksum:
  - `cliAccess`
  - `cliDirectUrl`
  - `cliFolioAccessToken`
  - `cliFolioLoginPath`
  - `cliFolioPass`
  - `cliFolioRefreshToken`
  - `cliFolioTenant`
  - `cliFolioToken`
  - `cliFolioUser`
  - `cliGatewayUrl`
  - `cliUserId`
  - `cliWd`


### Git Hash Support

A **Git** hash may be automatically appended onto **Workflow** versions when building.
This functionality is not enabled by default and requires the `-g` or `--git` parameter to be passed.


## Running mock FOLIO

Provides mock `/authn/login-with-expiry` and `/user-import`.

```
yarn gateway
```
