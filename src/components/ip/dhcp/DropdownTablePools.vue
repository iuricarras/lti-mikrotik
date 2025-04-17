<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CircleX, Cross, MoreHorizontal, Pencil, Info } from 'lucide-vue-next'
import axios from 'axios'
import { onMounted, ref, inject, reactive } from 'vue'
import PoolForm from './PoolForm.vue'


var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')
const getDHCPPools = inject('getDHCPPools')

const props = defineProps<{
  row_value
}>()

const ip_pool = reactive({
  '.id': props.row_value[".id"],
  name: props.row_value.name,
  ranges: props.row_value.ranges,
})

function deleteConfirmed() {

  axios.delete('http://localhost:5000/rest/ip/pool?id=' + ip_pool['.id'])
    .then(response => {
      openToast('Addresses pool deleted', 'The addresses pool has been successfully deleted.', 'success')
      getDHCPPools()
    })
    .catch(error => {
      openToast('Error deleting addresses pool', error.response.data.detail ? error.response.data.detail : error.statusText, 'destructive')
    });
}

function deleteDHCPPool() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this Addresses Pool ?', 'Cancel', 'Yes',
    'If you delete it you may lost the connection to this router depending on your configuration')
}

</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="deleteDHCPPool()">
            <div class="flex cursor-pointer">
              <component :is="CircleX" class="mr-2 h-5" />
              <span>Delete Addresses Pool</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger as-child>
              <div class="flex cursor-pointer">
                <component :is="Pencil" class="mr-2 h-5" />
                <span>Edit Addresses Pool</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Addresses Pool</DialogTitle>
        <DialogDescription>
          Edit settings from {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <PoolForm @close-dialog="closeDialog" :ip_pool="ip_pool"/>
      </div>
    </DialogContent>
  </Dialog>
</template>