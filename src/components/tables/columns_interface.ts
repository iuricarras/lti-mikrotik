import type { ColumnDef } from '@tanstack/vue-table'
import Dropdown from '@/components/tables/DropdownTable.vue';
import { h } from 'vue'

interface Interface{
    name: string
    ip: string
    bridge: string
}

export const columns: ColumnDef<Interface>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'mac-address',
        header: 'MAC Address',
    },
    {
        accessorKey: 'disabled',
        header: 'Disabled',
    },
]