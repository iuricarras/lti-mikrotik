<script setup>
import { onMounted, ref } from 'vue';
import Table from '@components/table/Table.vue';
import { ColumnsBridge } from '@components/bridge/columns_bridge';
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
    <h1 class="text-4xl mb-12">Bridges</h1>
    <div class="w-full mt-12">
      <Table :data="bridges" :columns="ColumnsBridge" />
    </div>
  </div>
</template>