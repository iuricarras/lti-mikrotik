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
import { ColumnsPorts } from './columns_ports'
import Table from '@/components/tables/Table.vue'
import BridgeForm from './BridgeForm.vue'



var selectedDialog = ref(0)

const changeSelectedDialog = (value) => {
  selectedDialog.value = value
}

var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)

const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')
const getBridges = inject('getBridges')

const props = defineProps<{
  row_value
}>()

const bridge = {
  name: props.row_value.name,
  arp: props.row_value.arp,
  id: props.row_value['.id']
}
const ports = ref([])

function getPorts() {
  axios.get('http://localhost:5000/rest/interface/bridge/port?bridge=' + props.row_value.name)
    .then(response => {
      ports.value = response.data;
    })
}

function deleteConfirmed() {
  if (props.row_value.name == "bridge1") { 
    openToast('Error deleting bridge1', 'bridge1 is not deletable', 'destructive')
    return }

  ports.value.forEach(element => {
    axios.delete('http://localhost:5000/rest/interface/bridge/port?id=' + element[".id"])
      .catch(error => {
      openToast('Error deleting bridge', 'Error deasssociating ports', 'destructive')
      return
    });
  });

  axios.get('http://localhost:5000/rest/ip/address')
    .then(response => {
      response.data.forEach(element => {
        if (element.interface == props.row_value.name){
          axios.delete('http://localhost:5000/rest/ip/address?id=' + element[".id"])
          .catch(error => {
          openToast('Error deleting bridge', 'Error deasssociating ip addresses', 'destructive')
          return
        });
        }
      });
    })
    .catch(error => {
      openToast('Error deleting bridge', 'Error deasssociating ip addresses', 'destructive')
      return
    });

    axios.get('http://localhost:5000/rest/ip/dhcp-server')
    .then(response => {
      response.data.forEach(element => {
        if (element.interface == props.row_value.name){
          axios.delete('http://localhost:5000/rest/ip/dhcp-server?id=' + element[".id"])
          .catch(error => {
          openToast('Error deleting bridge', 'Error deasssociating DCHP servers', 'destructive')
          return
        });
        }
      });
    })
    .catch(error => {
      openToast('Error deleting bridge', 'Error deasssociating DCHP servers', 'destructive')
      return
    });

  axios.delete('http://localhost:5000/rest/interface/bridge?id=' + props.row_value[".id"])
    .then(response => {
      openToast('Bridge deleted', 'The bridge interface has been successfully deleted.', 'success')
      getBridges()
    })
    .catch(error => {
      openToast('Error deleting bridge', error.response.data.detail ? error.response.data.detail : error.statusText, 'destructive')
    });
}

function deleteBridge() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this bridge interface ?', 'Cancel', 'Yes',
    'If you delete it you may lost the connection to this router depending on your configuration')
}

onMounted(() => {
  getPorts()
})

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
      <div v-if="props.row_value.name != 'bridge1'">
          <DropdownMenuItem @click="deleteBridge()">
            <div class="flex cursor-pointer">
              <component :is="CircleX" class="mr-2 h-5" />
              <span>Delete Bridge</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem @click="changeSelectedDialog(2)">
            <DialogTrigger as-child>
              <div class="flex cursor-pointer">
                <component :is="Pencil" class="mr-2 h-5" />
                <span>Edit Bridge</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
      </div>
        <DropdownMenuItem @click="changeSelectedDialog(1)">
          <DialogTrigger as-child>
            <div class="flex cursor-pointer">
              <component :is="Info" class="mr-2 h-5" />
              <span>Show Bridge Ports</span>
            </div>
          </DialogTrigger>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent v-if="selectedDialog == 1">
      <DialogHeader>
        <DialogTitle>Ports List</DialogTitle>
        <DialogDescription>
          List of ports from bridge {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <Table :data="ports" :columns="ColumnsPorts" />
      </div>
    </DialogContent>
    <DialogContent v-if="selectedDialog == 2">
      <DialogHeader>
        <DialogTitle>Edit Bridge</DialogTitle>
        <DialogDescription>
          Edit settings from {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <BridgeForm @close-dialog="closeDialog" :bridge="bridge"/>
      </div>
    </DialogContent>
  </Dialog>
</template>