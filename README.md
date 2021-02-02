# fw-cli
FOLIO Workflow CLI

```
git submodule update --init --recursive

yarn install
yarn build
npm link

fw

cd mod-workflow
mvn clean install
cd service
mvn clean spring-boot:run

cd mod-camunda
mvn clean spring-boot:run
```

> remember to update your config working directory and module urls, `fm -c`
