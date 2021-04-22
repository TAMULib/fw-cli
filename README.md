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

> remember to update your config working directory and module urls, `fw -c`
