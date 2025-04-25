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
import { CircleX, CirclePlus, Cross, MoreHorizontal, Pencil, Info } from 'lucide-vue-next'
import axios from 'axios'
import { onMounted, ref, inject } from 'vue'
import { ColumnsPorts } from './columns_ports'
import Table from '@/components/tables/Table.vue'
import PortForm from './PortForm.vue'

var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)

const getAllPorts = inject('getAllPorts')


const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')

const props = defineProps<{
  row_value
}>()

const port = {
  interface: props.row_value.interface,
  role: props.row_value.role,
  bridge: props.row_value.bridge,
  id: props.row_value.id
}

function deleteConfirmed() {
    if (port.interface === 'ether1' || port.interface === 'ether2') {
      openToast('Error deleting port', 'Port' + port.interface + ' cannot be removed', 'destructive')
      return
    }
    axios.delete('http://localhost:5000/rest/interface/bridge/port?id=' + port.id)
      .then(response => {
        openToast('Port deleted', 'The port has been successfully removed from the bridge.', 'success')
        getAllPorts()
      })
      .catch(error => {
        openToast('Error removing port', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
      });

}

function deletePort() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to remove this port ?', 'Cancel', 'Yes',
    'If you remove it you may lost the connection to this router depending on your configuration')
}
</script>

<template>
<div v-if="port.interface !== 'ether1' && port.interface !== 'ether2'">
  <Dialog v-model:open="isDialogOpen">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem v-if="port.id !== 'none'" @click="deletePort()">
          <div class="flex cursor-pointer">
            <component :is="CircleX" class="mr-2 h-5" />
            <span>Remove Port from Bridge</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem v-if="port.bridge == 'none'">
          <DialogTrigger as-child>
            <div class="flex cursor-pointer">
              <component :is="CirclePlus" class="mr-2 h-5" />
              <span>Link Port to Bridge</span>
            </div>
          </DialogTrigger>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Port to a Bridge</DialogTitle>
        <DialogDescription>
          Add {{ port.interface }} to a bridge
        </DialogDescription>
      </DialogHeader>
      <div>
        <PortForm @close-dialog="closeDialog" :port="port"/>
      </div>
    </DialogContent>
  </Dialog>
</div>

</template>