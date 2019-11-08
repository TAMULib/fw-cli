# fm-cli
FOLIO Migration CLI

```
git submodule update --init --recursive

yarn install
yarn build
npm install -g ./

fm

vagrant up

cd mod-workflow
mvn clean install
cd service
mvn clean spring-boot:run

cd mod-camunda
mvn clean spring-boot:run

cd mod-data-extractor
mvn clean spring-boot:run

cd mod-external-reference-resolve
mvn clean spring-boot:run
```

> `mod-data-extractor` requires installing Oracle JDBC drivers and configuring credentials for database connections.

> `mod-workflow` has configuration URL to mod-camunda deployment. If using FOLIO vagrant need to set this to http://localhost:9000
