import type { ColumnDef } from '@tanstack/vue-table'
import Dropdown from '@/components/bridge/DropdownTable.vue';
import { h } from 'vue'

interface Bridge{
    name: string
    ip: string
    bridge: string
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
        accessorKey: 'running',
        header: 'Running',
    },
    {
        accessorKey: 'disabled',
        header: 'Disabled',
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