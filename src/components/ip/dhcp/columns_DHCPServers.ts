import type { ColumnDef } from '@tanstack/vue-table'
import Disabled from './Disabled.vue';
import Dropdown from './DropdownTable.vue';
import { h } from 'vue'

interface DHCPServer{
    name: string
    disabled: string,
}

export const ColumnsDHCPServer: ColumnDef<DHCPServer>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'address-pool',
        header: 'Address Pool',
    },
    {
        accessorKey: 'interface',
        header: 'Interface',
    },
    {
            header: 'Disabled',
            id: 'disabled',
            enableHiding: false,
            cell: ({ row }) => {
                var row_value = row.original
                return h('div', { class: 'relative' }, h(Disabled, {
                status: row_value.disabled != 'true' ,
                }))
            },
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