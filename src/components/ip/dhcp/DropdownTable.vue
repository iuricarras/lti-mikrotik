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
import DHCPServerForm from './DHCPServerForm.vue'


var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')
const getDHCPServers = inject('getDHCPServers')

const props = defineProps<{
  row_value
}>()

const dhcp_server = reactive({
  '.id': props.row_value[".id"],
  name:  props.row_value.name,
  'address-pool':  props.row_value['address-pool'],
  interface:  props.row_value['interface'],
  'lease-time': "30m",
})

function deleteConfirmed() {

  axios.delete('http://localhost:5000/rest/ip/dhcp-server?id=' + dhcp_server['.id'])
    .then(response => {
      openToast('DHCP server deleted', 'The DHCP server has been successfully deleted.', 'success')
      getDHCPServers()
    })
    .catch(error => {
      openToast('Error deleting DHCP server', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
    });
}

function deleteDHCPServer() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this DHCP server ?', 'Cancel', 'Yes',
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
          <DropdownMenuItem @click="deleteDHCPServer()">
            <div class="flex cursor-pointer">
              <component :is="CircleX" class="mr-2 h-5" />
              <span>Delete DHCP Server</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger as-child>
              <div class="flex cursor-pointer">
                <component :is="Pencil" class="mr-2 h-5" />
                <span>Edit DHCP Server</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit DHCP Server</DialogTitle>
        <DialogDescription>
          Edit settings from {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <DHCPServerForm @close-dialog="closeDialog" :dhcp_server="dhcp_server"/>
      </div>
    </DialogContent>
  </Dialog>
</template>