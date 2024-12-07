# -*- mode: ruby -*-
# vi: set ft=ruby :
# Build a VM to serve as an Okapi/Docker server
# Deploy development environment

Vagrant.configure(2) do |config|

  if Vagrant::Util::Platform.windows?
    config.vm.synced_folder ".", "/vagrant", disabled: "true"
  end

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 36864
    vb.cpus = 8
  end

  # https://app.vagrantup.com/folio/boxes/snapshot
  config.vm.define "snapshot", autostart: false do |snapshot|
    snapshot.vm.box = "folio/snapshot"

    snapshot.vm.synced_folder "C:/Users/FOLIO/fw-cli", "/home/vagrant/fw-cli", owner: "vagrant", group: "vagrant", mount_options: ["uid=1000", "gid=1000"]

    # okapi
    snapshot.vm.network "forwarded_port", guest: 9130, host: 9130
    # stripes
    snapshot.vm.network "forwarded_port", guest: 3000, host: 3000
    # 
    snapshot.vm.network "forwarded_port", guest: 8000, host: 8130
    # kafka-ui
    snapshot.vm.network "forwarded_port", guest: 8080, host: 8080
    # postgres
    snapshot.vm.network "forwarded_port", guest: 5432, host: 5432
    # kafka
    # snapshot.vm.network "forwarded_port", guest: 9092, host: 9092
    # kafka
    # snapshot.vm.network "forwarded_port", guest: 29092, host: 29092
    # zookeeper
    # snapshot.vm.network "forwarded_port", guest: 2181, host: 2181
    #
    # snapshot.vm.network "forwarded_port", guest: 9001, host: 9001
    # snapshot.vm.network "forwarded_port", guest: 9002, host: 9002
  end

  # https://app.vagrantup.com/folio/boxes/release
  config.vm.define "release", autostart: false do |release|
    release.vm.box = "folio/release"

    release.vm.synced_folder "C:/Users/FOLIO/fw-cli", "/home/vagrant/fw-cli", owner: "vagrant", group: "vagrant", mount_options: ["uid=1000", "gid=1000"]

    # okapi
    release.vm.network "forwarded_port", guest: 9130, host: 9130
    # stripes
    release.vm.network "forwarded_port", guest: 3000, host: 3000
    # 
    release.vm.network "forwarded_port", guest: 8000, host: 8130
    # kafka-ui
    release.vm.network "forwarded_port", guest: 8080, host: 8080
    # postgres
    release.vm.network "forwarded_port", guest: 5432, host: 5432
    # kafka
    # release.vm.network "forwarded_port", guest: 9092, host: 9092
    # kafka
    # release.vm.network "forwarded_port", guest: 29092, host: 29092
    # zookeeper
    # release.vm.network "forwarded_port", guest: 2181, host: 2181
    #
    # release.vm.network "forwarded_port", guest: 9001, host: 9001
    # release.vm.network "forwarded_port", guest: 9002, host: 9002
  end

end
