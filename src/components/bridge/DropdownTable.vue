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
import { onMounted, ref } from 'vue'
import { ColumnsPorts } from './columns_ports'
import Table from '@/components/tables/Table.vue'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


var alertDialog = inject('alertDialog')

const props = defineProps<{
  row_value
}>()

const ports = ref([])

function getPorts() {
  axios.get('http://localhost:5000/rest/interface/bridge/port?bridge=' + props.row_value.name)
    .then(response => {
      ports.value = response.data;
      console.log('Fetched ports:', ports.value);
    })
    .catch(error => {
      console.error('Error fetching ports:', error);
    });
}

function deleteConfirmed() {
  if (props.row_value.name == "bridge1") { console.log("bridge1 is not deletable"); return }

  ports.value.forEach(element => {
    axios.delete('http://localhost:5000/rest/interface/bridge/port?id=' + element[".id"])
      .then(response => {
        console.log('Port deleted:', response.data);
      })
      .catch(error => {
        console.error('Error deleting port:', error);
      });
  });

  axios.delete('http://localhost:5000/rest/interface/bridge?id=' + props.row_value[".id"])
    .then(response => {
      console.log('Bridge deleted:', response.data);
    })
    .catch(error => {
      console.error('Error deleting bridge:', error);
    });

    router.push({ name: 'interfaces' }).then(() => {
      router.push({ name: 'bridges' })
    })
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
  <Dialog>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="w-8 h-8 p-0">
          <span class="sr-only">Open menu</span>
          <MoreHorizontal class="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="deleteBridge()">
          <div class="flex cursor-pointer">
            <component :is="CircleX" class="mr-2 h-5" />
            <span>Delete Bridge</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <div class="flex cursor-pointer">
            <component :is="Pencil" class="mr-2 h-5" />
            <span>Edit Bridge</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem>

          <DialogTrigger as-child>
            <div class="flex cursor-pointer">
              <component :is="Info" class="mr-2 h-5" />
              <span>Show Bridge Ports</span>
            </div>
          </DialogTrigger>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
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
  </Dialog>
</template>