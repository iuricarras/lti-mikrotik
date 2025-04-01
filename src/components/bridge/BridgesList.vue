<script setup>
import DataTable from '@/components/tables/DataTable.vue';
import { columns } from '@/components/interfaces/columns_interface';
var data = [
    {
        name: 'eth0',
        type: 'Ethernet',
        ip: '192.168.10.1',
    },
    {
        name: 'eth1',
        type: 'Erhernet',
        ip: '192.168.10.2',
    },
    {
        name: 'lo',
        type: 'Loopback',
        ip: '192.168.10.3',
    },
]
</script>

<template>
    <DataTable
        :columns="columns" 
        :data="data"
        class="w-full">
        </DataTable>
</template>