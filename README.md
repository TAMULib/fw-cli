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

## Building images for deployment

Update `Vagrantfile` with a synced directory to fw-cli for mod-workflow and mod-camunda development.

```
snapshot.vm.synced_folder "C:/Users/FOLIO/Development/work/FOLIO/fw-cli", "/home/vagrant/fw-cli", owner: "vagrant", group: "vagrant", mount_options: ["uid=1000", "gid=1000"]
```
> ***Be sure to update the host machine path.***

## Running FOLIO Locally

```
vagrant up snapshot
```

Wait for Okapi to start all the modules.

```
vagrant ssh snapshot
```

Check to see if Okapi is ready.
```
docker logs okapi -n 100 -f
```

Goto http://localhost:3000 and login.


## Build the jar file and descriptors on the host machine

```
cd spring-module-core
# git checkout <branch>
mvn clean package

cd ../mod-workflow
# git checkout <branch>
mvn clean package

cd ../mod-camunda
# git checkout <branch>
mvn clean package
```

## Build the docker images on the folio/snapshot vagrant docker client

```
vagrant ssh snapshot
```

From `/home/vagrant`:
```
cd fw-cli

cd mod-workflow
docker build -t docker.ci.folio.org/mod-workflow:1.2.0-SNAPSHOT .

cd ../mod-camunda
docker build -t docker.ci.folio.org/mod-camunda:1.2.0-SNAPSHOT .
```

> ***Update versions according to corresponding pom.xml***


## Run mod-workflow and mod-camunda with folio/snapshot

A bare minimum setup script `setup.js` is available to perform the necessary requests to run the modules with Okapi. This requires the previous steps of building jar files and module descriptors on the host and building the Docker images on the Vagrant VM.

From `/home/vagrant/fw-cli`:
```
node ./setup.js
```

## Update user permissions for mod-workflow and mod-camunda

The following permissions are required. There is additional ui-workflow permissions required when bundling and running ui-workflow with stripes. This is not yet available in folio/snapshot and is not provided here.

```
"workflow.actions.all",
"workflow.events.all",
"workflow.nodes.all",
"workflow.nodes.item.post",
"workflow.triggers.all",
"workflow.tasks.all",
"workflow.workflows.all",
"camunda.history.all",
"camunda.message.all",
"camunda.process.all",
"camunda.process-definition.all",
"camunda.decision-definition.all",
"camunda.task.all",
"camunda.workflow-engine.workflows.all"
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

### [create-notes](https://github.com/TAMULib/fw-registry/tree/main#create-notes)

Manual triggered workflow to create Notes within FOLIO.

### [create-tags](https://github.com/TAMULib/fw-registry/tree/main#create-tags)

Manual triggered workflow to create Tags within FOLIO.

### [shelflist-holdings](https://github.com/TAMULib/fw-registry/tree/main#shelflist-holdings)

Manual triggered workflow to build, zip, and email shelflist (holdings level) report.

### [item-history-update](https://github.com/TAMULib/fw-registry/tree/main/item-history-update)

Cron triggered workflow to run update item history.

### [nbs-items-note](https://github.com/TAMULib/fw-registry/tree/main/nbs-items-note)

Cron triggered workflow to run adding a special Note to New Bookshelf Items.

### [books-call-number](https://github.com/TAMULib/fw-registry/tree/main/books-call-number)

Manual triggered workflow to build, zip, and email list of checked out books by call number.

### [remove-books-from-nbs](https://github.com/TAMULib/fw-registry/tree/main/remove-books-from-nbs)

Manual triggered workflow with CSV of call numbers input that updates corresponding items temporary location and temporary loan type effectively removing them from the new bookshelf.

### [evans-pres-repr](https://github.com/TAMULib/fw-registry/tree/main/evans-pres-repr)

Cron triggered workflow to send monthly report to email specified by 'evansPresReprFrom' variable. The report includes items having 'temporary location' set to "Eva Pres Repr".

### [duplicate-instance-report](https://github.com/TAMULib/fw-registry/tree/main/duplicate-instance-report)

Cron triggered workflow to email quarterly instance duplication report.
