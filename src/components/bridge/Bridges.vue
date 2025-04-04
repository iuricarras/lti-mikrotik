<script setup>
import { onMounted, ref } from 'vue';
import Table from '../tables/Table.vue';
import { ColumnsBridge } from './columns_bridge';
import { ColumnsAllPorts } from './columns_all_ports';
import axios from 'axios';
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

function getBridges() {
  console.log('Interfaces component mounted');
  axios.get('http://localhost:5000/rest/interface/bridge')
    .then(response => {
      data.value = response.data;
      columnsType.value = ColumnsBridge;
      console.log('Fetched Bridges:', data.value);
    })
    .catch(error => {
      console.error('Error fetching bridges:', error);
    });
}

function getAllPorts(){
  console.log('Interfaces component mounted');
  axios.get('http://localhost:5000/rest/interface/bridge/port')
    .then(response => {
      data.value = response.data;
      columnsType.value = ColumnsAllPorts;
      console.log('Fetched Ports:', data.value);
    })
    .catch(error => {
      console.error('Error fetching ports:', error);
    });
}

onMounted(() => {
  getBridges();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">Bridges</h1>
    <div class="flex items-center justify-between border-none text-base">
      <div class="flex space-x-3">
        <button
          class="h-10 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
          :class="{ 'bg-gray-800 hover:bg-gray-800': !isPorts }" @click="getBridges()">
          <div class="px-4">Bridges</div>
        </button>
        <button
          class="h-10 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
          :class="{ 'bg-gray-800 hover:bg-gray-800': isPorts }" @click="getAllPorts()">
          <div class="px-4">Ports</div>
        </button>
      </div>
      <Dialog>
        <DialogTrigger as="button" class="h-10 text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500">
          <div class="px-4">Adicionar Bridge</div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Bridge</DialogTitle>
            <DialogDescription>
              Adicione uma nova bridge.
            </DialogDescription>
          </DialogHeader>
          <div>
            
          </div>>
          <DialogFooter>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <div class="w-full mt-12">
      <Table :data="data" :columns="columnsType" />
    </div>
  </div>
</template>