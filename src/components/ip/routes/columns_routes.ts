import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Dropdown from '@/components/ip/routes/DropdownTable.vue';
interface Route{
    name: string
    ip: string
}

export const ColumnsRoutes: ColumnDef<Route>[] = [
    {
        accessorKey: 'dst-address',
        header: 'Destination Address',
    },
    {
        accessorKey: 'gateway',
        header: 'Gateway',
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
    },
]