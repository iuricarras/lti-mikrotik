<script setup>
import { onMounted, ref, inject } from 'vue';
import axios from 'axios';
import Table from '../tables/Table.vue';
import { ColumnsInterface } from './columns_interface';
let interfaces = ref([]);

const openToast = inject('openToast')

function getInterfaces() {
  console.log('Interfaces component mounted');
  axios.get('http://localhost:5000/rest/interface')
    .then(response => {
      console.log('Fetched interfaces:', response.data);
      interfaces.value = response.data;
    })
    .catch(error => {
      openToast('Error fetching interfaces', error.response.data.detail ? error.response.data.detail : error.statusText, 'destructive')
    });
}


onMounted(() => {
  getInterfaces();
});
</script>

<template>
  <div class="pl-12 pt-12 pr-10 w-full h-screen ">
    <h1 class="text-4xl mb-12">Interfaces</h1>
  
    <div class="w-full mt-12">
      <Table :data="interfaces" :columns="ColumnsInterface" />
    </div>
  </div>
</template>