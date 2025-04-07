<script setup>
import { onMounted, ref } from 'vue';
import Table from '../tables/Table.vue';
import { ColumnsBridge } from './columns_bridge';
import { ColumnsAllPorts } from './columns_all_ports';
import axios from 'axios';
import {provide} from 'vue'
import BridgeForm from './BridgeForm.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

let data = ref([]);
let columnsType = ref([]);
let isPorts = ref(false);
import { CirclePlus } from 'lucide-vue-next';
let bridges = ref([]);
let isBridge = ref(true);
let updateTable = ref(false);
const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

function getBridges() {
  updateTable.value = true;
  console.log('Interfaces component mounted');
  axios.get('http://localhost:5000/rest/interface/bridge')
    .then(response => {
      bridges.value = response.data;
      console.log('Fetched Bridges:', bridges.value);
      updateTable.value = false;
    })
    .catch(error => {
      updateTable.value = false;
      console.error('Error fetching bridges:', error);
    });
}

provide('getBridges', getBridges);

onMounted(() => {
  getBridges();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">Bridges</h1>
    <div class="flex space-x-3 border-none text-base">
      <button
        class=" h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': isBridge }" @click="getInterfaces()">
        <div class="px-4">Bridges</div>
      </button>
      <button
        class="h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': !isBridge }"
        @click="getWirelessInterfaces()">
        <div class="px-4">Ports</div>
      </button>
      <div class="w-full h-10 flex justify-end">
        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger>
            <div class="flex cursor-pointer">
              <component :is="CirclePlus" class="mr-2 h-5" />
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Briddge</DialogTitle>
              <DialogDescription>
                Configure a new bridge interface
              </DialogDescription>
            </DialogHeader>
            <div>
              <BridgeForm @close-dialog="closeDialog"/>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    <div  class="w-full mt-12">
      <Table v-if="!updateTable" :data="bridges" :columns="ColumnsBridge" />
    </div>
  </div>
</template>