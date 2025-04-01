<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CircleX, Cross, MoreHorizontal, Pencil, Info } from 'lucide-vue-next'
import  BridgePorts  from '@/components/bridge/BridgePorts.vue'

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
        <div class="flex cursor-pointer">
          <component :is="CircleX" class="mr-2 h-5"/>
          <span>Delete Bridge</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <div class="flex cursor-pointer">
          <component :is="Pencil" class="mr-2 h-5"/>
          <span>Edit Bridge</span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <BridgePorts/>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>