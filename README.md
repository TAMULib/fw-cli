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

```
fw -c
{
  "wd": "./fw-registry",
  "okapi": "https://folio-okapi-r1.library.tamu.edu",
  "okapi-internal": "http://okapi:9130",
  "tenant": "tamu",
  "username": "tamu_admin",
  "password": "***",
  "userId": "f340b8ba-2958-479d-ac79-c283020e20cd",
  "mod-camunda": "https://folio-edge.library.tamu.edu/mod-camunda",
  "mod-camunda-internal": "http://mod-camunda:8081",
  "mod-workflow": "https://folio-edge.library.tamu.edu/mod-workflow",
  "mod-workflow-internal": "http://mod-workflow:8081",
  "divit-url": "jdbc:sqlserver://itsqldev.tamu.edu;databaseName=cis",
  "divit-user": "patron",
  "divit-password": "***",
  "sample-mail-to": "wwelling@library.tamu.edu",
  "sample-mail-from": "helpdesk@library.tamu.edu",
  "orcid-mail-to": "dhahn@library.tamu.edu,ethel@library.tamu.edu",
  "orcid-mail-from": "voyager@surprise.tamu.edu",
  "gobi-mail-from": "acqmoord@library.tamu.edu",
  "gobi-mail-to": "amandagirard@ybp.com",
  "ldp-url": "jdbc:postgresql://folio-ldp-db.library.tamu.edu:5432/ldp",
  "ldp-user": "ldp",
  "ldp-password": "***",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0YW11X2FkbWluIiwidXNlcl9pZCI6ImYzNDBiOGJhLTI5NTgtNDc5ZC1hYzc5LWMyODMwMjBlMjBjZCIsImlhdCI6MTYyMjY0NTAwMywidGVuYW50IjoidGFtdSJ9.iWZhbsNWJwS66-g5mQZ_cVHax7jZvCXig7BOpx6MCyU"
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
