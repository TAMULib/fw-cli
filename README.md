# fw-cli

The **FOLIO Workflow Command Line Interface**.

This is a helper script for creating, running, and deleting workflows.


## Getting Started
```
git submodule update --init --recursive

yarn install
yarn build
yarn link

fw
```


## Important Settings

These are some configuration settings with special meaning that are managed directly by `fw-cli`.

| Setting            | Description
| ------------------ | -----------
| `access`           | Used to toggle between the **OKAPI** URL and the `mod-workflow` URL (Set to either `okapi` or `mod-workflow`).
| `accessToken`      | The **FOLIO Access Token** cookie, or `X-Okapi-Token` (in both cases, `folioAccessToken` contains the token).
| `okapi`            | The **OKAPI** URL to use.
| `okapiLoginPath`   | The login path to use (for classic, use `/authn/login`; for RTR, use `/authn/login-with-expiry`).
| `mod-workflow`     | The `mod-workflow` URL.
| `password`         | The pass to use for logging into **OKAPI**.
| `refreshToken`     | The **FOLIO Refresh Token** cookie (`folioRefreshToken` contains the refresh token).
| `tenant`           | The `tenant` to use for logging into and interacting with **OKAPI** or `mod-workflow`.
| `token`            | The `X-Okapi-Token` or the `accessToken.folioAccessToken` string.
| `username`         | The user to use for logging into **OKAPI**.
| `userId`           | The **User ID** retrieved from the last `user` command call.
| `wd`               | The working directory that contains the `fw-registry` files (usually either `./fw-registry/` or `./fw-registry/examples`.


## Running mock FOLIO

Provides mock `/authn/login-with-expiry` and `/user-import`.

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

A bare minimum setup script `setup.js` is available to perform the necessary requests to run the modules with Okapi.
This requires the previous steps of building jar files and module descriptors on the host and building the Docker images on the Vagrant VM.

From `/home/vagrant/fw-cli`:
```
node ./setup.js
```


## Update user permissions for mod-workflow and mod-camunda

The following permissions are required.
There is additional `ui-workflow` permissions required when bundling and running `ui-workflow` with stripes.
*The `ui-workflow` is not yet available in `folio/snapshot` and is not provided here.*

```
"workflow.actions.all",
"workflow.events.all",
"workflow.nodes.all",
"workflow.nodes.item.post",
"workflow.tasks.all",
"workflow.triggers.all",
"workflow.workflows.all",
"camunda.decision-definition.all",
"camunda.history.all",
"camunda.message.all",
"camunda.process.all",
"camunda.process-definition.all",
"camunda.task.all",
"camunda.workflow-engine.workflows.all"
```


## Watch Kafka broker

```
docker run -d --name kafka-ui --user 1000:1000 -p 8080:8080 -e KAFKA_CLUSTERS_0_NAME=folio -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=10.0.2.15:9092 -e KAFKA_CLUSTERS_0_ZOOKEEPER=10.0.2.15:2181 provectuslabs/kafka-ui:latest
```

Open http://localhost:8080 in the browser to see the kafka-ui interface.


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
  "okapi": "https://okapi.folio.org",
  "tenant": "diku",
  "username": "diku_admin",
  "password": "",
  "mod-camunda": "https://folio.folio.org/mod-camunda"
}
```

e.g.
```
fw config set tenant diku
```

Login to get a Okapi token.

```
fw login
```

Lookup user.

```
fw user diku_admin
```

Follow configuration, build, activate and run commands for workflows as described in the [FW Registry Readme](fw-registry/README.md).
