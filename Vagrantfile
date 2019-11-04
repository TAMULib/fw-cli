# -*- mode: ruby -*-
# vi: set ft=ruby :
# Build a VM to serve as an Okapi/Docker server
# Deploy development environment

Vagrant.configure(2) do |config|

  # Give us a little headroom
  # Note that provisioning a Stripes webpack requires more RAM
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 16384
    vb.cpus = 4
  end

  config.vm.define "testing", autostart: true do |testing|
    testing.vm.box = "folio/testing"

    testing.vm.synced_folder ".", "/vagrant", type: "smb", mount_options: ["vers=3.02"]

    testing.vm.network "forwarded_port", guest: 3000, host: 3000
    testing.vm.network "forwarded_port", guest: 8000, host: 8130

    testing.vm.network "forwarded_port", guest: 9130, host: 9130
    testing.vm.network "forwarded_port", guest: 9131, host: 9131
    testing.vm.network "forwarded_port", guest: 9132, host: 9132
    testing.vm.network "forwarded_port", guest: 9133, host: 9133
    testing.vm.network "forwarded_port", guest: 9134, host: 9134
    testing.vm.network "forwarded_port", guest: 9135, host: 9135
    testing.vm.network "forwarded_port", guest: 9136, host: 9136
    testing.vm.network "forwarded_port", guest: 9137, host: 9137
    testing.vm.network "forwarded_port", guest: 9138, host: 9138
    testing.vm.network "forwarded_port", guest: 9139, host: 9139

    testing.vm.network "forwarded_port", guest: 9140, host: 9140
    testing.vm.network "forwarded_port", guest: 9141, host: 9141
    testing.vm.network "forwarded_port", guest: 9142, host: 9142
    testing.vm.network "forwarded_port", guest: 9143, host: 9143
    testing.vm.network "forwarded_port", guest: 9144, host: 9144
    testing.vm.network "forwarded_port", guest: 9145, host: 9145
    testing.vm.network "forwarded_port", guest: 9146, host: 9146
    testing.vm.network "forwarded_port", guest: 9147, host: 9147
    testing.vm.network "forwarded_port", guest: 9148, host: 9148
    testing.vm.network "forwarded_port", guest: 9149, host: 9149

    testing.vm.network "forwarded_port", guest: 9150, host: 9150
    testing.vm.network "forwarded_port", guest: 9151, host: 9151
    testing.vm.network "forwarded_port", guest: 9152, host: 9152
    testing.vm.network "forwarded_port", guest: 9153, host: 9153
    testing.vm.network "forwarded_port", guest: 9154, host: 9154
    testing.vm.network "forwarded_port", guest: 9155, host: 9155
    testing.vm.network "forwarded_port", guest: 9156, host: 9156
    testing.vm.network "forwarded_port", guest: 9157, host: 9157
    testing.vm.network "forwarded_port", guest: 9158, host: 9158
    testing.vm.network "forwarded_port", guest: 9159, host: 9159

    testing.vm.network "forwarded_port", guest: 9160, host: 9160
    testing.vm.network "forwarded_port", guest: 9161, host: 9161
    testing.vm.network "forwarded_port", guest: 9162, host: 9162
    testing.vm.network "forwarded_port", guest: 9163, host: 9163
    testing.vm.network "forwarded_port", guest: 9164, host: 9164
    testing.vm.network "forwarded_port", guest: 9165, host: 9165
    testing.vm.network "forwarded_port", guest: 9166, host: 9166
    testing.vm.network "forwarded_port", guest: 9167, host: 9167
    testing.vm.network "forwarded_port", guest: 9168, host: 9168
    testing.vm.network "forwarded_port", guest: 9169, host: 9169

    testing.vm.network "forwarded_port", guest: 9170, host: 9170
    testing.vm.network "forwarded_port", guest: 9171, host: 9171
    testing.vm.network "forwarded_port", guest: 9172, host: 9172
    testing.vm.network "forwarded_port", guest: 9173, host: 9173
    testing.vm.network "forwarded_port", guest: 9174, host: 9174
    testing.vm.network "forwarded_port", guest: 9175, host: 9175
    testing.vm.network "forwarded_port", guest: 9176, host: 9176
    testing.vm.network "forwarded_port", guest: 9177, host: 9177
    testing.vm.network "forwarded_port", guest: 9178, host: 9178
    testing.vm.network "forwarded_port", guest: 9179, host: 9179

    testing.vm.network "forwarded_port", guest: 9180, host: 9180
    testing.vm.network "forwarded_port", guest: 9181, host: 9181
    testing.vm.network "forwarded_port", guest: 9182, host: 9182
    testing.vm.network "forwarded_port", guest: 9183, host: 9183
    testing.vm.network "forwarded_port", guest: 9184, host: 9184
    testing.vm.network "forwarded_port", guest: 9185, host: 9185
    testing.vm.network "forwarded_port", guest: 9186, host: 9186
    testing.vm.network "forwarded_port", guest: 9187, host: 9187
    testing.vm.network "forwarded_port", guest: 9188, host: 9188
    testing.vm.network "forwarded_port", guest: 9189, host: 9189

    testing.vm.network "forwarded_port", guest: 9190, host: 9190
    testing.vm.network "forwarded_port", guest: 9191, host: 9191
    testing.vm.network "forwarded_port", guest: 9192, host: 9192
    testing.vm.network "forwarded_port", guest: 9193, host: 9193
    testing.vm.network "forwarded_port", guest: 9194, host: 9194
    testing.vm.network "forwarded_port", guest: 9195, host: 9195
    testing.vm.network "forwarded_port", guest: 9196, host: 9196
    testing.vm.network "forwarded_port", guest: 9197, host: 9197
    testing.vm.network "forwarded_port", guest: 9198, host: 9198
    testing.vm.network "forwarded_port", guest: 9199, host: 9199

    testing.vm.network "forwarded_port", guest: 9000, host: 9000
    testing.vm.network "forwarded_port", guest: 9001, host: 9001
    testing.vm.network "forwarded_port", guest: 9002, host: 9002
    testing.vm.network "forwarded_port", guest: 9003, host: 9003
    testing.vm.network "forwarded_port", guest: 9004, host: 9004
    testing.vm.network "forwarded_port", guest: 9005, host: 9005
    testing.vm.network "forwarded_port", guest: 61616, host: 61616
  end

end
