<script setup>
import { onMounted, ref } from 'vue';
import Table from '../tables/Table.vue';
import { ColumnsBridge } from './columns_bridge';
import axios from 'axios';
import {provide} from 'vue'
let bridges = ref([]);
let isBridge = ref(true);

function getBridges() {
  console.log('Interfaces component mounted');
  axios.get('http://localhost:5000/rest/interface/bridge')
    .then(response => {
      bridges.value = response.data;
      console.log('Fetched Bridges:', bridges.value);
    })
    .catch(error => {
      console.error('Error fetching bridges:', error);
    });
}

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
    </div>
    <div  class="w-full mt-12">
      <Table :data="bridges" :columns="ColumnsBridge" />
    </div>
  </div>
</template>