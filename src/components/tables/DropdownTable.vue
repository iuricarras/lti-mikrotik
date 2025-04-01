<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CircleX, Cross, MoreHorizontal, Pencil } from 'lucide-vue-next'

function copy(id: string) {
  navigator.clipboard.writeText(id)
}
const props = defineProps<{
  row_value: {
    name: string
  }
}>()

console.log(props.row_value.name)
</script>

<template>

  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>
        <div class="flex">
          <component :is="CircleX" class="mr-2 h-5"/>
          <span>Delete Interface</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <div class="flex">
          <component :is="Pencil" class="mr-2 h-5"/>
          <span>Edit Interface</span>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>