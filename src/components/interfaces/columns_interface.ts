import type { ColumnDef } from '@tanstack/vue-table'

interface Interface{
    name: string
    ip: string
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
        accessorKey: 'disabled',
        header: 'Disabled',
    },
]