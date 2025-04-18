<script setup>
import { ref, onMounted, inject, reactive} from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  dns_static: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getDNSStatic = inject('getDNSStatic')

let have_error = ref(false)
const error_message_name = ref('')
const error_message_address = ref('')

const dns_static = reactive({
  name: props.dns_static?.name != null ? props.dns_static.name : '',
  address: props.dns_static?.address != null ? props.dns_static.address : ''
})

function isValidIPv4(ip) {
  const regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return regex.test(ip);
}

const insertStaticDNS = async () => {
  try {
    const response = await axios.put('http://localhost:5000/rest/ip/dns/static', dns_static).then(() => {
      getDNSStatic()
      openToast('DNS static entry inserted', 'The DNS static entry has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting DNS static entry', error.response.data.detail ? error.response.data.detail : error.statusText, 'destructive')
  }
}

const updateStaticDNS = async () => {
  try {
    const response = await axios.patch('http://localhost:5000/rest/ip/dns/static?id=' + props.dns_static['.id'] , dns_static).then(() => {
      getDNSStatic()
      openToast('DNS static entry updated', 'The DNS static entry has been successfully updated.', 'success')
    })
  } catch (error) {
    openToast('Error updating DNS static entry', error.response.data.detail ? error.response.data.detail : error.statusText, 'destructive')
  }
}

const submitForm = () => {
  error_message_name.value = ''
  error_message_address.value = ''
  have_error.value = false

  if (dns_static.name === '') {
    error_message_name.value = 'You must provide a name to be resolved'
    have_error.value = true
  }
   if (dns_static.address === '') {
    error_message_address.value = 'The resolved IP address is required'
    have_error.value = true
   }

  if(have_error.value) {
    return
  }

  if (!isValidIPv4(dns_static.address)) {
    error_message_address.value = 'Invalid IP address'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (props.dns_static?.name != null) {
    updateStaticDNS()
  } else {
    insertStaticDNS()
  }
  emit('closeDialog')
}

</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="dns_static.name" placeholder="Name to resolve into a IP address" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_name}} </p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">IP</label>
            <input type="text" name="s_ip" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="dns_static.address" placeholder="IP Address associated" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_address}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>