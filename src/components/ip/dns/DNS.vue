<script setup>
import { onMounted, ref, inject} from 'vue';
import Table from '../../tables/Table.vue';
import axios from 'axios';
import {provide} from 'vue'
import ExternalDNS from './ExternalDNS.vue';
import DNSStaticForm from './DNSStaticForm.vue';
import { ColumnsDNS } from './columns_dns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { CircleCheck, CircleOff, CirclePlus, Pencil } from 'lucide-vue-next';
let dns = ref([]);
let dns_static = ref([]);
let isExternal = ref(true);
let updateTable = ref(true);
const isDialogOpen = ref(false)
var alertDialog = inject('alertDialog')
const openToast = inject('openToast')

const closeDialog = () => {
  isDialogOpen.value = false
}

function getDNS() {
  updateTable.value = true;
  isExternal.value = true;
  axios.get('http://localhost:5000/rest/ip/dns')
    .then(response => {
      console.log('response', response.data);
      dns.value = response.data;
      console.log('dns', dns.value);
      updateTable.value = false;
    })
    .catch(error => {
      updateTable.value = false;
    });
}

function getDNSStatic() {
  updateTable.value = true;
  isExternal.value = false;
  axios.get('http://localhost:5000/rest/ip/dns/static')
    .then(response => {
      console.log('response', response.data);
      dns_static.value = response.data;
      console.log('dns_static', dns_static.value);
      updateTable.value = false;
    })
    .catch(error => {
      updateTable.value = false;
    });
}



function changeRemoteStatus() {
  if(dns.value['allow-remote-requests'] == "true") {
    dns.value['allow-remote-requests'] = "false"
  } else {
    dns.value['allow-remote-requests'] = "true"
  }

  axios.post('http://localhost:5000/rest/ip/dns/set', { 'allow-remote-requests': dns.value['allow-remote-requests'] })
    .then(response => {
      openToast('DNS remote requests status changed', 'The DNS remote requests status has been successfully altered.', 'success')
      getDNS()
    })
    .catch(error => {
      openToast('Error changing DNS remote requests status', error.response?.data?.detail != null ? error.response.data.detail : error.statusText, 'destructive')
    });
}

function disableRemote() {
  alertDialog.value.open(
    changeRemoteStatus,
    'Do you really want to disable DNS remote requests ?', 'Cancel', 'Yes',
    'If you do it you may lost the connection to some services depending on your configuration')
}

function enableRemote() {
  alertDialog.value.open(
    changeRemoteStatus,
    'Do you really want to enable DNS remote requests ?', 'Cancel', 'Yes',
    'Be sure that the DNS servers to be used are trusted')
}

provide('getDNS', getDNS);
provide('getDNSStatic', getDNSStatic);

onMounted(() => {
  getDNS();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">DNS Server</h1>
    <div class="flex space-x-3 border-none text-base">
      <button
        class=" h-10  basis-64 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': isExternal }" @click="getDNS">
        <div class="px-4">External Resolution</div>
      </button>
      <button
        class="h-10  text-center basis-64 rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': !isExternal }" @click="getDNSStatic">
        <div class="px-4">Internal Resolution</div>
      </button>
      <div class="w-full h-10 flex items-center justify-end">
        <Dialog v-if="isExternal" v-model:open="isDialogOpen">
          <DialogTrigger>
            <div class="flex cursor-pointer">
              <component :is="Pencil" class="mr-2 h-5" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit External DNS</DialogTitle>
              <DialogDescription>
                Configure the external DNS server settings
              </DialogDescription>
            </DialogHeader>
            <div>
              <ExternalDNS v-if="!updateTable" @close-dialog="closeDialog" :edit="true" :dns="{'allow-remote-requests': dns['allow-remote-requests'], servers: dns.servers}"/>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog v-if="!isExternal" v-model:open="isDialogOpen">
          <DialogTrigger>
            <div class="flex cursor-pointer">
              <component :is="CirclePlus" class="mr-2 h-5" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Static DNS Entry</DialogTitle>
              <DialogDescription>
                Configure a new DNS static entry
              </DialogDescription>
            </DialogHeader>
            <div>
              <DNSStaticForm v-if="!updateTable" @close-dialog="closeDialog"/>
            </div>
          </DialogContent>
        </Dialog>
        <div v-if="dns['allow-remote-requests'] == 'true' && isExternal" @click="disableRemote" class="flex cursor-pointer">
              <component :is="CircleOff" class="mr-2 h-5" />
        </div>
        <div v-if="dns['allow-remote-requests'] == 'false' && isExternal" @click="enableRemote" class="flex cursor-pointer">
              <component :is="CircleCheck" class="mr-2 h-5" />
        </div>
      </div>
    </div>
    <div v-if="isExternal && !updateTable" class="mt-12 mx-auto w-1/3 border-2 shadow-md rounded-md">
      <ExternalDNS @close-dialog="closeDialog" :edit="false" :dns="{'allow-remote-requests': dns['allow-remote-requests'], servers: dns.servers}"/>
    </div>
    <div  v-if="!isExternal" class="w-full mt-12">
      <Table v-if="!updateTable" :data="dns_static" :columns="ColumnsDNS" />
    </div>
  </div>
</template>