<script setup>
import { onMounted, ref, inject, provide } from 'vue';
import axios from 'axios';
import Table from '../../tables/Table.vue';
import { ColumnsAddresses } from './columns_addresses';
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
import AddressesForm from './AddressesForm.vue';
let addresses = ref([]);
const isDialogOpen = ref(false)
const isLoading = ref(false)
const closeDialog = () => {
  isDialogOpen.value = false
}
const openToast = inject('openToast')

function getAddresses() {
  isLoading.value = true
  axios.get('http://localhost:5000/rest/ip/address')
    .then(response => {
      addresses.value = response.data;
      isLoading.value = false
    })
    .catch(error => {
      openToast('Error fetching addresses', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
      isLoading.value = false
    });
}

provide('getAddresses', getAddresses);

onMounted(() => {
  getAddresses();
});
</script>

<template>
  <div v-if="!isLoading" class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">IP Addresses</h1>
    <div class="flex space-x-3 border-none text-base">
      <div class="w-full h-10 flex justify-end">
        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger>
            <div class="flex cursor-pointer">
              <component :is="CirclePlus" class="mr-2 h-5" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create IP Address</DialogTitle>
              <DialogDescription>
                Configure a new IP address
              </DialogDescription>
            </DialogHeader>
            <div>
              <AddressesForm @close-dialog="closeDialog"/>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    <div class="w-full mt-12">
      <Table :data="addresses" :columns="ColumnsAddresses" />
    </div>
  </div>
</template>