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
import SecurityProfilesForm from './SecurityProfilesForm.vue'


var alertDialog = inject('alertDialog')

const isDialogOpen = ref(false)
let found = false
const closeDialog = () => {
  isDialogOpen.value = false
}

const openToast = inject('openToast')
const getSecurityProfiles = inject('getSecurityProfiles')

const props = defineProps<{
  row_value
}>()

const security_profile = ref({
  name: props.row_value.name,
  mode: props.row_value.mode,
  "authentication-types": props.row_value["authentication-types"],
  "wpa2-pre-shared-key": props.row_value["wpa2-pre-shared-key"],
  id: props.row_value['.id']
})


function deleteConfirmed() {

  axios.get('/rest/interface/wireless')
    .then(response => {
      let interfaces = response.data;
      found = false
      interfaces.forEach(element => {
        if (element["security-profile"] === security_profile.value.name) {
          openToast('Error deleting security profile', 'You must remove the security profile from all wireless interfaces before deleting it', 'destructive')
          found = true
          return
        }
      })

      if(!found){
        axios.delete('/rest/interface/wireless/security-profiles?id=' + security_profile.value.id)
        .then(response => {
          openToast('Security profile deleted', 'The security profile has been successfully deleted.', 'success')
          getSecurityProfiles()
        })
        .catch(error => {
          openToast('Error deleting security profile', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
        })
      }


    })
    .catch(error => {
      openToast('Error deleting security profile', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
    });

}

function deleteSecurityProfile() {
  alertDialog.value.open(
    deleteConfirmed,
    'Do you really want to delete this security profile ?', 'Cancel', 'Yes',
    'If you delete it you may lost the connection to this router depending on your configuration')
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
          <DropdownMenuItem @click="deleteSecurityProfile">
            <div class="flex cursor-pointer">
              <component :is="CircleX" class="mr-2 h-5" />
              <span>Delete Security Profile</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger as-child>
              <div class="flex cursor-pointer">
                <component :is="Pencil" class="mr-2 h-5" />
                <span>Edit Security Profile</span>
              </div>
            </DialogTrigger>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Security Profile</DialogTitle>
        <DialogDescription>
          Edit settings from {{ props.row_value.name }}
        </DialogDescription>
      </DialogHeader>
      <div>
        <SecurityProfilesForm @close-dialog="closeDialog" :security_profile="security_profile"/>
      </div>
    </DialogContent>
  </Dialog>
</template>