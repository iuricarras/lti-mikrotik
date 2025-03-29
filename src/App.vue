<script setup>
import { ref, onMounted } from 'vue'
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

</script>

<template>
<SidebarProvider>
    <AppSidebar />
    <main>
      <RouterView />  <!-- or <slot /> -->
    </main>
  </SidebarProvider>
</template>
