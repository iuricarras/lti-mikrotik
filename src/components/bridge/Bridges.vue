<script setup>
import { onMounted, ref } from 'vue';
import Table from '@components/table/Table.vue';
import { ColumnsBridge } from '@components/bridge/columns_bridge';
import axios from 'axios';

let bridges = ref([]);

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
    <h1 class="text-4xl mb-12">Bridges</h1>
    <div class="w-full mt-12">
      <Table :data="bridges" :columns="ColumnsBridge" />
    </div>
  </div>
</template>