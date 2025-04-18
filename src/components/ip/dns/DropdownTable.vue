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
import { CircleX, Cross, MoreHorizontal, Pencil, Info, CircleOff, CircleCheck } from 'lucide-vue-next'
import axios from 'axios'
import { onMounted, ref, inject } from 'vue'
import Table from '@/components/tables/Table.vue'
import DNSStaticForm from './DNSStaticForm.vue'

var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')
const getDNSStatic = inject('getDNSStatic')

const props = defineProps<{
  row_value
}>()

const dns_static = {
  '.id': props.row_value['.id'],
  name: props.row_value.name,
  address: props.row_value.address,
  disabled: props.row_value.disabled
}

function changeEntryStatus() {
  if(dns_static.disabled == "true") {
    dns_static.disabled = "false"
  } else {
    dns_static.disabled = "true"
  }

  axios.patch('http://localhost:5000/rest/ip/dns/static?id=' + props.row_value['.id'], dns_static)
    .then(response => {
      openToast('DNS static entry status changed', 'The DNS static entry  status has been successfully altered.', 'success')
      getDNSStatic()
    })
    .catch(error => {
      openToast('Error changing DNS static entry status', error.response?.data?.detail != null ? error.response.data.detail : error.statusText, 'destructive')
    });
}

function disableEntry() {
  alertDialog.value.open(
    changeEntryStatus,
    'Do you really want to disable this DNS static entry  ?', 'Cancel', 'Yes',
    'If you do it you may lost the connection to some services depending on your configuration')
}

function enableEntry() {
  alertDialog.value.open(
    changeEntryStatus,
    'Do you really want to enable this DNS static entry  ?', 'Cancel', 'Yes',
    'Be sure that the DNS entry is still valid')
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
      <div v-if="props.row_value.disabled != 'true'">
          <DropdownMenuItem @click="disableEntry">
            <div class="flex cursor-pointer">
              <component :is="CircleOff" class="mr-2 h-5" />
              <span>Disable DNS Static Entry</span>
            </div>
          </DropdownMenuItem>
      </div>
      <div v-if="props.row_value.disabled == 'true'">
          <DropdownMenuItem @click="enableEntry">
            <div class="flex cursor-pointer">
              <component :is="CircleCheck" class="mr-2 h-5" />
              <span>Enable DNS Static Entry</span>
            </div>
          </DropdownMenuItem>
      </div>
          <DropdownMenuItem>
            <DialogTrigger as-child>
              <div class="flex cursor-pointer">
                <component :is="Pencil" class="mr-2 h-5" />
                <span>Edit DNS Static Entry</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit DNS Static Entry</DialogTitle>
        <DialogDescription>
          Edit settings from {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <DNSStaticForm @close-dialog="closeDialog" :dns_static="dns_static"/>
      </div>
    </DialogContent>
  </Dialog>
</template>