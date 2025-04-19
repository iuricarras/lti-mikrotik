<script setup>
import { ref, onMounted, inject, reactive} from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
import Disabled from './Disabled.vue';
const props = defineProps({
  dns: {
    type: Object,
    required: true
  },
  edit: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getDNS = inject('getDNS')

let have_error = ref(false)
const error_message_name = ref('')
const error_message_din_1 = ref('')
const error_message_din_2 = ref('')
let din_1 = ''
let din_2 = ''

let dns = reactive({
  'allow-remote-requests': props.dns['allow-remote-requests'],
  servers : '',
})

if(props.dns.servers.split(',').length > 1) {
   din_1 = props.dns.servers.split(',')[0]
   din_2 = props.dns.servers.split(',')[1]
}else if(props.dns.servers.split(',').length === 1 && props.dns.servers.split(',')[0] !== '') {
    din_1 = props.dns.servers.split(',')[0]
}


function isValidIPv4(ip) {
  const regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return regex.test(ip);
}


const updateDNSServer = async () => {
  if (din_1 !== '' && din_2 !== '') {
    dns.servers = din_1 + ',' + din_2
  } else if (din_1 !== '' && din_2 === '') {
    dns.servers = din_1
  }else if (din_1 === '' && din_2 !== '') {
    dns.servers = din_2
  }
  try {
    const response = await axios.post('http://localhost:5000/rest/ip/dns/set', dns).then(() => {
      getDNS()
      openToast('DNS server updated', 'The DNS server has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error updating DNS server', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const submitForm = () => {
  error_message_din_1.value = ''
  error_message_din_2.value = ''
  have_error.value = false

   if (din_1 === '') {
    error_message_din_1.value = 'DNS server is required'
    have_error.value = true
   }

  if(have_error.value) {
    return
  }

  if (!isValidIPv4(din_1)) {
    error_message_din_1.value = 'Invalid DNS server IP address'
    have_error.value = true
  }

  if (!isValidIPv4(din_2) && din_2 !== '') {
    error_message_din_2.value = 'Invalid DNS server IP address'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (din_1 === din_2) {
    error_message_din_2.value = 'The DNS server IP address cannot be the same'
    return
  }

  updateDNSServer()

  emit('closeDialog')
}

</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div v-if="!props.edit" class="mb-8">
            <label class="block text-gray-700">Allow Remote Requests</label>
            <Disabled :status="dns['allow-remote-requests'] == 'true'"></Disabled>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">External DNS Server 1</label>
            <input type="text" name="s_ip" :disabled="!props.edit" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="din_1" placeholder="External DNS Server 1" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_din_1}} </p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">External DNS Server 2</label>
            <input type="text" name="e_ip" :disabled="!props.edit" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="din_2" placeholder="External DNS Server 2" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_din_2}} </p>
            </div>
        </div>
        <button v-if="props.edit" type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>