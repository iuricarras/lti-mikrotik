import type { ColumnDef } from '@tanstack/vue-table'

interface Interface{
    name: string
    ip: string
    bridge: string
}

export const ColumnsWireless: ColumnDef<Interface>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'mac-address',
        header: 'MAC Address',
    },
    {
        accessorKey: 'disabled',
        header: 'Disabled',
    },
]