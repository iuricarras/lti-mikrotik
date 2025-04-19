import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Dropdown from '@/components/ip/addresses/DropdownTable.vue';
interface Address{
    name: string
    ip: string
}

export const ColumnsAddresses: ColumnDef<Address>[] = [
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'interface',
        header: 'Interface',
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