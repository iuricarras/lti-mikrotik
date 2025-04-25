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
        accessorKey: 'mtu',
        header: 'MTU',
    },
    {
        accessorKey: 'listen-port',
        header: 'Listen Port',
    },
    {
        accessorKey: 'public-key',
        header: 'Public Key',
    },
    {
        header: 'Status',
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