import type { ColumnDef } from '@tanstack/vue-table'
import Dropdown from '@/components/tables/DropdownTable.vue';
import { h } from 'vue'

interface Interface{
    name: string
    ip: string
    bridge: string
}

export const ColumnsBridge: ColumnDef<Interface>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'ip',
        header: 'IP Address',
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