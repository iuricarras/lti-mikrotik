import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Dropdown from '@/components/wireless/DropdownTable.vue';

interface SecurityProfiles{
    name: string
}

export const ColumnsSecurityProfiles: ColumnDef<SecurityProfiles>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'authentication-types',
        header: 'Authentication Types',
    },
    {
        accessorKey: 'mode',
        header: 'Mode',
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