<script setup>
import { onMounted, ref, inject, provide} from 'vue';
import axios from 'axios';
import Table from '../tables/Table.vue';
import { ColumnsWireless } from './columns_wireless';
import { ColumnsSecurityProfiles } from './columns_securityProfiles';
import { CirclePlus } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SecurityProfilesForm from './SecurityProfilesForm.vue';

let interfaces = ref([]);
let securityProfiles = ref([]);
let isWireless = ref(true);
let updateTable = ref(false);
const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast');

function getWirelessInterfaces() {
  isWireless.value = true;
  updateTable.value = true;
  axios.get('http://localhost:5000/rest/interface/wireless')
    .then(response => {
      interfaces.value = response.data;
      updateTable.value = false;
    })
    .catch(error => {
      openToast('Error fetching wireless interfaces', error?.response?.data?.detail != null ? error.response.data.detail : error.message,'destructive');
    });
}

function getSecurityProfiles() {
  isWireless.value = false;
  updateTable.value = true;
  axios.get('http://localhost:5000/rest/interface/wireless/security-profiles')
    .then(response => {
      securityProfiles.value = response.data;
      updateTable.value = false;
    })
    .catch(error => {
      openToast('Error fetching security profiles', error?.response?.data?.detail != null ? error.response.data.detail : error.message,'destructive');
    });
}

provide('getWirelessInterfaces', getWirelessInterfaces);
provide('getSecurityProfiles', getSecurityProfiles);

onMounted(() => {
  getWirelessInterfaces();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">Wireless Networks</h1>
    <div class="flex space-x-3 border-none text-base">
      <button
        class=" h-10 basis-64 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': isWireless }" @click="getWirelessInterfaces()">
        <div class="px-4">Wireless Networks</div>
      </button>
      <button
        class="h-10 basis-64 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': !isWireless }"
        @click="getSecurityProfiles()">
        <div class="px-4">Security Profiles</div>
      </button>
      <div class="w-full h-10 flex justify-end">
        <Dialog v-if="!isWireless" v-model:open="isDialogOpen">
          <DialogTrigger>
            <div class="flex cursor-pointer">
              <component :is="CirclePlus" class="mr-2 h-5" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Security Profile</DialogTitle>
              <DialogDescription>
                Configure a new security profile
              </DialogDescription>
            </DialogHeader>
            <div>
              <SecurityProfilesForm @close-dialog="closeDialog"/>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    <div v-if="isWireless" class="w-full mt-12">
      <Table v-if="!updateTable" :data="interfaces" :columns=" ColumnsWireless"/>
    </div>
    <div v-if="!isWireless" class="w-full mt-12">
      <Table v-if="!updateTable" :data="securityProfiles" :columns=" ColumnsSecurityProfiles"/>
    </div>
  </div>
</template>