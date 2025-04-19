<script setup>
import { ref, onMounted, provide, useTemplateRef } from 'vue'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form'
import { h } from 'vue'
import axios from 'axios'
import { RouterView } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import SidebarTrigger from './components/ui/sidebar/SidebarTrigger.vue'
import { SidebarProvider } from './components/ui/sidebar'
import GlobalAlertDialog from '@/components/GlobalAlertDialog.vue';
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from './components/stores/auth'


const storeAuth = useAuthStore()

const { toast } = useToast()
const onSubmit = async values => {
  console.log(values);
  if (values.method === 'get') {
    await axios.get(values.url, {
      headers: {
        'X-Auth-Token': values.token
      }
    }).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    });
  }else{
    console.log(JSON.parse(values.body));
    await axios.post(values.url, JSON.parse(values.body), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    });
  }
}

const alertDialog = useTemplateRef('alert-dialog');
provide('alertDialog', alertDialog);

const openToast = (title_received, description_received, variant_recieved) => {
      toast({
        title: title_received,
        description: description_received,
        variant: variant_recieved,
      });
    }
  
provide('openToast', openToast);

</script>

<template>
  <div class="h-screen overflow-hidden">
      <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
      <div :class="{'mx-auto md:ml-64': storeAuth.ip}">
        <main>
            <RouterView />  <!-- or <slot /> -->
          </main>
      </div>
      <div>
        <SidebarProvider v-if="storeAuth.ip">
          <AppSidebar />
        </SidebarProvider>
      </div>
      <Toaster/>
  </div>
</template>
