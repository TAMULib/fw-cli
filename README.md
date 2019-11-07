# fmcli
FOLIO Migration CLI

```
yarn install
yarn build
npm install -g ./

vagrant up

git submodule update --init --recursive

cd mod-workflow
mvn clean spring-boot:run

cd mod-camunda
mvn clean spring-boot:run

cd mod-data-extractor
mvn clean spring-boot:run

cd mod-external-reference-resolve
mvn clean spring-boot:run
```