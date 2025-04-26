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
import { CircleX, Cross, MoreHorizontal, Pencil, Info, CircleCheck, CircleOff } from 'lucide-vue-next'
import axios from 'axios'
import { onMounted, ref, inject } from 'vue'
import Table from '@/components/tables/Table.vue'
import WirelessInterfaceForm from './WirelessInterfaceForm.vue'


var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')
const getWirelessInterfaces = inject('getWirelessInterfaces')

const props = defineProps<{
  row_value
}>()

const wlan = ref({
  mode : props.row_value.mode,
  ssid: props.row_value.ssid,
  "security-profile": props.row_value["security-profile"],
  frequency: props.row_value.frequency,
  band: props.row_value.band,
  id: props.row_value['.id']
})


function enableConfirmed(){
  axios.post('/rest/interface/wireless/enable', {".id": wlan.value.id } )
    .then(response => {
      openToast('Wireless interface enabled', 'The wireless interface has been successfully enabled.', 'success')
      getWirelessInterfaces()
    })
    .catch(error => {
      openToast('Error enabling wireless interface', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
    });
}

function disableConfirmed(){
  axios.post('/rest/interface/wireless/disable', {".id": wlan.value.id } )
    .then(response => {
      openToast('Wireless interface disabled', 'The wireless interface has been successfully disabled.', 'success')
      getWirelessInterfaces()
    })
    .catch(error => {
      openToast('Error disabling wireless interface', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
    });
}


function disableWireless() {
  alertDialog.value.open(
    disableConfirmed,
    'Do you really want to disable this wireless interface ?', 'Cancel', 'Yes',
    'If you disable this interface you may lost the connection to this router depending on your configuration')
}


function enableWireless() {
  alertDialog.value.open(
    enableConfirmed,
    'Do you really want to enable this wireless interface ?', 'Cancel', 'Yes',
    'Enabling this interface will expose the router to the wireless network.')
}

</script>

<template>
  <Dialog v-model:open="isDialogOpen" v-if="props.row_value.name != 'default'">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem v-if="props.row_value.disabled === 'false'" @click="disableWireless()">
            <div class="flex cursor-pointer">
              <component :is="CircleOff" class="mr-2 h-5" />
              <span>Disable Wireless Interface</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem v-if="props.row_value.disabled === 'true'" @click="enableWireless()">
            <div class="flex cursor-pointer">
              <component :is="CircleCheck" class="mr-2 h-5" />
              <span>Enable Wireless Interface</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger as-child>
              <div class="flex cursor-pointer">
                <component :is="Pencil" class="mr-2 h-5" />
                <span>Edit Wireless Interface</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Wireless Interface Settings</DialogTitle>
        <DialogDescription>
          Edit settings from {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <WirelessInterfaceForm @close-dialog="closeDialog" :wlan="wlan"/>
      </div>
    </DialogContent>
  </Dialog>
</template>