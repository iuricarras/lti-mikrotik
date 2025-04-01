<script setup>
import { onMounted, ref } from 'vue';
import InterfacesList from './InterfacesList.vue';
import axios from 'axios';

let interfaces = ref([]);
let isWireless = ref(false);


function getInterfaces() {
  console.log('Interfaces component mounted');
  axios.get('http://localhost:5000/rest/interface')
    .then(response => {
      interfaces.value = response.data;
      isWireless.value = false;
      console.log('Fetched interfaces:', interfaces.value);
    })
    .catch(error => {
      console.error('Error fetching interfaces:', error);
    });
}

function getWirelessInterfaces() {
  console.log('Wireless Interfaces component mounted');
  axios.get('http://localhost:5000/rest/interface/wireless')
    .then(response => {
      interfaces.value = response.data;
      isWireless.value = true;
      console.log('Fetched wireless interfaces:', interfaces.value);
    })
    .catch(error => {
      console.error('Error fetching wireless interfaces:', error);
    });
}



onMounted(() => {
  getInterfaces();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">Interfaces</h1>
    <div class="flex space-x-3 border-none text-base">
      <button
        class=" h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': !isWireless }" @click="getInterfaces()">
        <div class="px-4">All Interfaces</div>
      </button>
      <button
        class="h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': isWireless }"
        @click="getWirelessInterfaces()">
        <div class="px-4">Wireless Interfaces</div>
      </button>
    </div>
    <div class="w-full mt-12">
      <InterfacesList :data="interfaces"/>
    </div>
  </div>
</template>