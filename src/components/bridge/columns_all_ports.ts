import type { ColumnDef } from '@tanstack/vue-table'
import Dropdown from '@/components/bridge/DropdownTablePorts.vue';
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
{
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            var row_value = row.original
            return h('div', { class: 'relative' }, h(Dropdown, {
                row_value,
            }))
        },
    } ,
]