<script setup>
import { onMounted, ref } from 'vue';
import Table from '../../tables/Table.vue';
import { ColumnsDHCPServer } from './columns_DHCPServers';
import { ColumnsIPPool } from './columns_IPPools';
import axios from 'axios';
import {provide} from 'vue'
import DHCPServerForm from './DHCPServerForm.vue';
import PoolForm from './PoolForm.vue';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CirclePlus } from 'lucide-vue-next';
let dhcp_servers = ref([]);
let ip_pools = ref([]);
let isDHCPServer = ref(true);
let updateTable = ref(false);
const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

function getDHCPServers() {
  updateTable.value = true;
  isDHCPServer.value = true;
  axios.get('/rest/ip/dhcp-server')
    .then(response => {
      dhcp_servers.value = response.data;
      updateTable.value = false;
    })
    .catch(error => {
      updateTable.value = false;
    });
}

function getDHCPPools() {
  updateTable.value = true;
  isDHCPServer.value = false;
  axios.get('/rest/ip/pool')
    .then(response => {
      ip_pools.value = response.data;
      updateTable.value = false;
    })
    .catch(error => {
      updateTable.value = false;
    });
}


provide('getDHCPServers', getDHCPServers);
provide('getDHCPPools', getDHCPPools);

onMounted(() => {
  getDHCPServers();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">DHCP</h1>
    <div class="flex space-x-3 border-none text-base">
      <button
        class=" h-10 basis-64 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': isDHCPServer }" @click="getDHCPServers()">
        <div class="px-4">DHCP Servers</div>
      </button>
      <button
        class="h-10 basis-64 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': !isDHCPServer }"
        @click="getDHCPPools()">
        <div class="px-4">Addresses Pools</div>
      </button>
      <div class="w-full h-10 flex justify-end">
        <Dialog  v-model:open="isDialogOpen">
          <DialogTrigger>
            <div class="flex cursor-pointer">
              <component :is="CirclePlus" class="mr-2 h-5" />
            </div>
          </DialogTrigger>
          <DialogContent v-if="isDHCPServer">
            <DialogHeader>
              <DialogTitle>Create DHCP Server</DialogTitle>
              <DialogDescription>
                Configure a new DHCP Server
              </DialogDescription>
            </DialogHeader>
            <div>
                <DHCPServerForm @close-dialog="closeDialog"></DHCPServerForm>
            </div>
          </DialogContent>
          <DialogContent v-if="!isDHCPServer">
            <DialogHeader>
              <DialogTitle>Create Addresses Pool</DialogTitle>
              <DialogDescription>
                Configure a new Addresses Pool
              </DialogDescription>
            </DialogHeader>
            <div>
                <PoolForm @close-dialog="closeDialog"></PoolForm>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    <div v-if="isDHCPServer" class="w-full mt-12">
      <Table v-if="!updateTable" :data="dhcp_servers" :columns="ColumnsDHCPServer" />
    </div>
    <div  v-if="!isDHCPServer" class="w-full mt-12">
      <Table v-if="!updateTable" :data="ip_pools" :columns="ColumnsIPPool" />
    </div>
  </div>
</template>