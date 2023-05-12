# fw-cli

FOLIO Workflow CLI

## Getting Started
```
git submodule update --init --recursive

yarn install
yarn build
yarn link

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

cd components
mvn clean install

cd ..
cd service
mvn clean spring-boot:run

```

In another terminal from `fw-cli`.

```
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

Cron triggered workflow to build ISBN report for GOBI.

### [e-resource](https://github.com/TAMULib/fw-registry/tree/main#e-resource)

Manual triggered workflow to build e-resource views in central IT database.

### [purchase-orders](https://github.com/TAMULib/fw-registry/tree/main#purchase-orders)

Manual triggered workflow to create composite purchase orders and the inventory from MARC records.

### [circ-fines](https://github.com/TAMULib/fw-registry/tree/main#circ-fines)

Cron triggered workflow to build and email circulation fees/fines paid daily report.

### [rapid-print-serials](https://github.com/TAMULib/fw-registry/tree/main#rapid-print-serials)

Cron triggered workflow to build and gzip Rapid ILS monthly print serials report.

### [rapid-print-monos](https://github.com/TAMULib/fw-registry/tree/main#rapid-print-monos)

Cron triggered workflow to build and gzip Rapid ILS monthly print monos report.

### [rapid-electronic-serials](https://github.com/TAMULib/fw-registry/tree/rapid-electronic-serials)

Cron triggered workflow to copy SFX Utility output and gzip Rapid ILS monthly electronic serials report.

### [coral-extract](https://github.com/TAMULib/fw-registry/tree/main#coral-extract)

Cron triggered workflow to run coral extract to create/update instances and holdings in FOLIO.

### [hathitrust](https://github.com/TAMULib/fw-registry/tree/main#hathitrust)

Manual triggered workflow to build multiple reports for HathiTrust upload.

### [create-tags](https://github.com/TAMULib/fw-registry/tree/main#create-tags)

Manual triggered workflow to create Tags within FOLIO.

### [shelflist-holdings](https://github.com/TAMULib/fw-registry/tree/main#shelflist-holdings)

Manual triggered workflow to build, zip, and email shelflist (holdings level) report.

### [item-history-update](https://github.com/TAMULib/fw-registry/tree/main/item-history-update)

Cron triggered workflow to run update item history.
