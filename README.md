# fw-cli

FOLIO Workflow CLI

## Getting Started
```
git submodule update --init --recursive

yarn install
yarn build
npm link

fw
```

## Running mock FOLIO

Provides mock `/authn/login` and `/user-import`.

```
yarn okapi
```

## Running FOLIO Locally

```
vagrant up release
```

## Running Workflow Modules Locally

```
cd mod-workflow
mvn clean install
cd service
mvn clean spring-boot:run

cd mod-camunda
mvn clean spring-boot:run
```

> remember to update your config working directory and configuration, `fw -c`

## Running Workflows in Production

Set the appropriate configurations.

Abbreviated config:

```
fw -c
{
  "wd": "./fw-registry",
  "okapi": "https://folio-okapi-r1.library.tamu.edu",
  "tenant": "tamu",
  "username": "tamu_admin",
  "password": "***",
  "mod-camunda": "https://folio-edge.library.tamu.edu/mod-camunda",
  "mod-workflow": "https://folio-edge.library.tamu.edu/mod-workflow"
}
```

e.g.
```
fw config set tenant tamu
```

Login to get a Okapi token.

```
fw login
```

Lookup user.

```
fw user tamu_admin
```

Follow configuration, build, activate and run commands for workflows.

### [patron](https://github.com/TAMULib/fw-registry/tree/main#patron)

Cron triggered workflow to import create/update patrons from central IT database.

### [orcid](https://github.com/TAMULib/fw-registry/tree/main#orcid)

Manual triggered workflow to build orcid report for Scholars.

### [gobi](https://github.com/TAMULib/fw-registry/tree/main#gobi)

Manual triggered workflow to build ISBN report for GOBI.

### [e-resource](https://github.com/TAMULib/fw-registry/tree/main#e-resource)

Manual triggered workflow to build e-resource views in central IT database.
