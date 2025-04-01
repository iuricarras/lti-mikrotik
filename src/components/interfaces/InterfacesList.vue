<script setup>
import DataTable from '@/components/tables/DataTable.vue';
import { columns } from '@/components/interfaces/columns_interface';
const props = defineProps({
    data: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <DataTable
        :columns="columns" 
        :data="data"
        class="w-full">
        </DataTable>
</template>