<script setup>
import { onMounted, ref, inject, provide } from 'vue';
import axios from 'axios';
import Table from '../../tables/Table.vue';
import { ColumnsRoutes } from './columns_routes';
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
import RoutesForm from './RoutesForm.vue';
let routes = ref([]);
const isDialogOpen = ref(false)
const isLoading = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}
const openToast = inject('openToast')

function getRoutes() {
  isLoading.value = true
  axios.get('/rest/ip/route')
    .then(response => {
      routes.value = response.data;
      isLoading.value = false
    })
    .catch(error => {
      openToast('Error fetching routes', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
      isLoading.value = false
    });
}

provide('getRoutes', getRoutes);

onMounted(() => {
  getRoutes();
});
</script>

<template>
  <div v-if="!isLoading" class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">IP Routes</h1>
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
              <DialogTitle>Create IP Route</DialogTitle>
              <DialogDescription>
                Configure a new IP route
              </DialogDescription>
            </DialogHeader>
            <div>
              <RoutesForm @close-dialog="closeDialog"/>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    <div class="w-full mt-12">
      <Table :data="routes" :columns="ColumnsRoutes" />
    </div>
  </div>
</template>