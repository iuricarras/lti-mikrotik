import type { ColumnDef } from '@tanstack/vue-table'
import Dropdown from './DropdownTable.vue';
import Disabled from './Disabled.vue'
import { h } from 'vue'

interface DNS{
    name: string
    disabled: string,
    running: string,
}

export const ColumnsDNS: ColumnDef<DNS>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
            header: 'Status',
            id: 'status',
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