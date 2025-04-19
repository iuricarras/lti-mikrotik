import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Ranges from './Ranges.vue'
import Dropdown from './DropdownTablePools.vue'

interface IPPool{
    name: string,
    ranges: string,
}

export const ColumnsIPPool: ColumnDef<IPPool>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        header: 'IP Ranges',
        id: 'ranges',
        enableHiding: false,
        cell: ({ row }) => {
            var row_value = row.original
            return h('div', { class: 'relative' }, h(Ranges, {
            range: row_value.ranges,
            }))
        },
     },
    {
        accessorKey: 'total',
        header: 'Total',
    },
    {
        accessorKey: 'available',
        header: 'Available',
    },
    {
        accessorKey: 'used',
        header: 'Used',
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