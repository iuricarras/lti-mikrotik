import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import Disabled from './Disabled.vue'
import Dropdown from '@/components/wireless/DropdownTableWireless.vue';

interface Wireless{
    name: string
    ip: string,
    disabled: string,
}

export const ColumnsWireless: ColumnDef<Wireless>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'mac-address',
        header: 'MAC Address',
    },
    {
        accessorKey: 'mode',
        header: 'Mode',
    },
    {
        accessorKey: 'ssid',
        header: 'SSID',
    },
    {
        accessorKey: 'security-profile',
        header: 'Security Profile',
    },
    {
        accessorKey: 'frequency',
        header: 'Frequency',
    },
    {
        accessorKey: 'band',
        header: 'Band',
    },
    {
        accessorKey: 'channel-width',
        header: 'Channel Width',
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