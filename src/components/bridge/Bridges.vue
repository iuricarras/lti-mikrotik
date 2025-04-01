<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

let bridges = ref([]);


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
    <h1 class="text-4xl mb-12">Interfaces</h1>
    <div class="flex space-x-3 border-none text-base">
      <button
        class=" h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': !isWireless }" @click="getInterfaces()">
        <div class="px-4">Physical Interfaces</div>
      </button>
      <button
        class="h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': isWireless }"
        @click="getWirelessInterfaces()">
        <div class="px-4">Wireless Interfaces</div>
      </button>
    </div>
    <div class="w-full mt-12">
      <InterfacesList />
    </div>
  </div>
</template>