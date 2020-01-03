# -*- mode: ruby -*-
# vi: set ft=ruby :
# Build a VM to serve as an Okapi/Docker server
# Deploy development environment

def frontend_port_mapping(config)
  config.vm.network "forwarded_port", guest: 3000, host: 3000
end

def backend_port_mapping(config)
  # config.vm.network "forwarded_port", guest: 8000, host: 8130
  config.vm.network "forwarded_port", guest: 9130, host: 9130

  config.vm.network "forwarded_port", guest: 9131, host: 9131
  config.vm.network "forwarded_port", guest: 9132, host: 9132
  config.vm.network "forwarded_port", guest: 9133, host: 9133
  config.vm.network "forwarded_port", guest: 9134, host: 9134
  config.vm.network "forwarded_port", guest: 9135, host: 9135
  config.vm.network "forwarded_port", guest: 9136, host: 9136
  config.vm.network "forwarded_port", guest: 9137, host: 9137
  config.vm.network "forwarded_port", guest: 9138, host: 9138
  config.vm.network "forwarded_port", guest: 9139, host: 9139

  config.vm.network "forwarded_port", guest: 9140, host: 9140
  config.vm.network "forwarded_port", guest: 9141, host: 9141
  config.vm.network "forwarded_port", guest: 9142, host: 9142
  config.vm.network "forwarded_port", guest: 9143, host: 9143
  config.vm.network "forwarded_port", guest: 9144, host: 9144
  config.vm.network "forwarded_port", guest: 9145, host: 9145
  config.vm.network "forwarded_port", guest: 9146, host: 9146
  config.vm.network "forwarded_port", guest: 9147, host: 9147
  config.vm.network "forwarded_port", guest: 9148, host: 9148
  config.vm.network "forwarded_port", guest: 9149, host: 9149

  config.vm.network "forwarded_port", guest: 9150, host: 9150
  config.vm.network "forwarded_port", guest: 9151, host: 9151
  config.vm.network "forwarded_port", guest: 9152, host: 9152
  config.vm.network "forwarded_port", guest: 9153, host: 9153
  config.vm.network "forwarded_port", guest: 9154, host: 9154
  config.vm.network "forwarded_port", guest: 9155, host: 9155
  config.vm.network "forwarded_port", guest: 9156, host: 9156
  config.vm.network "forwarded_port", guest: 9157, host: 9157
  config.vm.network "forwarded_port", guest: 9158, host: 9158
  config.vm.network "forwarded_port", guest: 9159, host: 9159

  config.vm.network "forwarded_port", guest: 9160, host: 9160
  config.vm.network "forwarded_port", guest: 9161, host: 9161
  config.vm.network "forwarded_port", guest: 9162, host: 9162
  config.vm.network "forwarded_port", guest: 9163, host: 9163
  config.vm.network "forwarded_port", guest: 9164, host: 9164
  config.vm.network "forwarded_port", guest: 9165, host: 9165
  config.vm.network "forwarded_port", guest: 9166, host: 9166
  config.vm.network "forwarded_port", guest: 9167, host: 9167
  config.vm.network "forwarded_port", guest: 9168, host: 9168
  config.vm.network "forwarded_port", guest: 9169, host: 9169

  config.vm.network "forwarded_port", guest: 9170, host: 9170
  config.vm.network "forwarded_port", guest: 9171, host: 9171
  config.vm.network "forwarded_port", guest: 9172, host: 9172
  config.vm.network "forwarded_port", guest: 9173, host: 9173
  config.vm.network "forwarded_port", guest: 9174, host: 9174
  config.vm.network "forwarded_port", guest: 9175, host: 9175
  config.vm.network "forwarded_port", guest: 9176, host: 9176
  config.vm.network "forwarded_port", guest: 9177, host: 9177
  config.vm.network "forwarded_port", guest: 9178, host: 9178
  config.vm.network "forwarded_port", guest: 9179, host: 9179

  config.vm.network "forwarded_port", guest: 9180, host: 9180
  config.vm.network "forwarded_port", guest: 9181, host: 9181
  config.vm.network "forwarded_port", guest: 9182, host: 9182
  config.vm.network "forwarded_port", guest: 9183, host: 9183
  config.vm.network "forwarded_port", guest: 9184, host: 9184
  config.vm.network "forwarded_port", guest: 9185, host: 9185
  config.vm.network "forwarded_port", guest: 9186, host: 9186
  config.vm.network "forwarded_port", guest: 9187, host: 9187
  config.vm.network "forwarded_port", guest: 9188, host: 9188
  config.vm.network "forwarded_port", guest: 9189, host: 9189

  config.vm.network "forwarded_port", guest: 9190, host: 9190
  config.vm.network "forwarded_port", guest: 9191, host: 9191
  config.vm.network "forwarded_port", guest: 9192, host: 9192
  config.vm.network "forwarded_port", guest: 9193, host: 9193
  config.vm.network "forwarded_port", guest: 9194, host: 9194
  config.vm.network "forwarded_port", guest: 9195, host: 9195
  config.vm.network "forwarded_port", guest: 9196, host: 9196
  config.vm.network "forwarded_port", guest: 9197, host: 9197
  config.vm.network "forwarded_port", guest: 9198, host: 9198
  config.vm.network "forwarded_port", guest: 9199, host: 9199

  # config.vm.network "forwarded_port", guest: 9000, host: 9000
  # config.vm.network "forwarded_port", guest: 9001, host: 9001
  # config.vm.network "forwarded_port", guest: 9002, host: 9002
  # config.vm.network "forwarded_port", guest: 9003, host: 9003
  # config.vm.network "forwarded_port", guest: 9004, host: 9004
  # config.vm.network "forwarded_port", guest: 9005, host: 9005
  # config.vm.network "forwarded_port", guest: 61616, host: 61616
end

Vagrant.configure(2) do |config|

  # Give us a little headroom
  # Note that provisioning a Stripes webpack requires more RAM
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 12388
    vb.cpus = 4
  end

  # https://app.vagrantup.com/folio/boxes/snapshot-backend-core
  config.vm.define "snapshot-backend-core", autostart: false do |snapshot_backend_core|
    snapshot_backend_core.vm.box = "folio/snapshot-backend-core"
    backend_port_mapping(snapshot_backend_core)
  end

  # https://app.vagrantup.com/folio/boxes/snapshot-core
  config.vm.define "snapshot-core", autostart: false do |snapshot_core|
    snapshot_core.vm.box = "folio/snapshot-core"
    frontend_port_mapping(snapshot_core)
    backend_port_mapping(snapshot_core)
  end

  # https://app.vagrantup.com/folio/boxes/snapshot
  config.vm.define "snapshot", autostart: false do |snapshot|
    snapshot.vm.box = "folio/snapshot"
    frontend_port_mapping(snapshot)
    backend_port_mapping(snapshot)
  end

  # https://app.vagrantup.com/folio/boxes/testing-backend
  config.vm.define "testing-backend", autostart: false do |testing_backend|
    testing_backend.vm.box = "folio/testing-backend"
    backend_port_mapping(testing_backend)
  end

  # https://app.vagrantup.com/folio/boxes/testing
  config.vm.define "testing", autostart: false do |testing|
    testing.vm.box = "folio/testing"
    frontend_port_mapping(testing)
    backend_port_mapping(testing)
  end

  if Vagrant::Util::Platform.windows?
    config.vm.synced_folder ".", "/vagrant", type: "smb", mount_options: ["vers=3.02"]
  end

  

end
