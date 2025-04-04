import type { ColumnDef } from '@tanstack/vue-table'
import Dropdown from '@/components/bridge/DropdownTable.vue';
import { h } from 'vue'

interface Ports{
    name: string
}

export const ColumnsAllPorts: ColumnDef<Ports>[] = [
    {
        accessorKey: 'interface',
        header: 'Name',
    },
    {
        accessorKey: 'bridge',
        header: 'Bridge',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
]