import type { ColumnDef } from '@tanstack/vue-table'
import Dropdown from '@/components/bridge/DropdownTable.vue';
import Disabled from './Disabled.vue'
import Running from './Running.vue';
import { h } from 'vue'

interface Bridge{
    name: string
    disabled: string,
    running: string,
}

export const ColumnsBridge: ColumnDef<Bridge>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'protocol-mode',
        header: 'Protocol Mode',
    },
    {
        accessorKey: 'mac-address',
        header: 'MAC Address',
    },
    {
            header: 'Running',
            id: 'running',
            enableHiding: false,
            cell: ({ row }) => {
                var row_value = row.original
                return h('div', { class: 'relative' }, h(Running, {
                status: row_value.running == 'true' ,
                }))
            },
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