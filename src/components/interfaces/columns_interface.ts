import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Disabled from './Disabled.vue'
interface Interface{
    name: string
    ip: string
    disabled: string,
}

export const ColumnsInterface: ColumnDef<Interface>[] = [
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
]