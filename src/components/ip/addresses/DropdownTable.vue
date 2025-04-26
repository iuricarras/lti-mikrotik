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
import { onMounted, ref, inject } from 'vue'
import Table from '@/components/tables/Table.vue'
import AddressesForm from './AddressesForm.vue';
var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')
const getAddresses = inject('getAddresses')

const props = defineProps<{
  row_value
}>()

const address = {
  address: props.row_value.address,
  interface: props.row_value.interface,
  ['.id']: props.row_value['.id']
}

function deleteConfirmed() {
  axios.delete('/rest/ip/address?id=' + props.row_value[".id"])
    .then(response => {
      openToast('Address deleted', 'The IP address has been successfully deleted.', 'success')
      getAddresses()
    })
    .catch(error => {
      openToast('Error deleting address', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
    });
}

function deleteAddress() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this address ?', 'Cancel', 'Yes',
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
          <DropdownMenuItem @click="deleteAddress()">
            <div class="flex cursor-pointer">
              <component :is="CircleX" class="mr-2 h-5" />
              <span>Delete Address</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger as-child>
              <div class="flex cursor-pointer">
                <component :is="Pencil" class="mr-2 h-5" />
                <span>Edit Address</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Address</DialogTitle>
        <DialogDescription>
          Edit settings from {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <AddressesForm @close-dialog="closeDialog" :address="address"/>
      </div>
    </DialogContent>
  </Dialog>
</template>