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
  <div class="p-8 mx-auto max-w-3xl">
    <h1 class="text-xl pb-8">Interfaces</h1>
    <nav class="flex space-x-1 border-b-2 border-gray-800 text-base">
      <button
        class=" h-10 leading-10 text-center rounded-t-xl border-none text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
        :class="{ 'bg-gray-800 hover:bg-gray-800': !isWireless }" @click="getInterfaces()">
        <div class="px-4">Interfaces</div>
      </button>
      <button
        class="h-10 leading-10 text-center rounded-t-xl border-none text-white select-none bg-gray-400 cursor-pointer hover:bg-gray-500"
        activeClass="bg-gray-800 hover:bg-gray-800" :class="{ 'bg-gray-800 hover:bg-gray-800': isWireless }"
        @click="getWirelessInterfaces()">

        <div class="px-4">Wireless Interfaces</div>
      </button>
    </nav>
    <InterfacesList />
    <!--
      Ver tabelas do shadcn-vue
      https://www.shadcn-vue.com/docs/components/data-table
    -->
    <hr>
  </div>
</template>