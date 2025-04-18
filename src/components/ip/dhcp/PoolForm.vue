<script setup>
import { ref, onMounted, inject, reactive} from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  ip_pool: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getDHCPPools = inject('getDHCPPools')

let have_error = ref(false)
const error_message_name = ref('')
const error_message_from = ref('')
const error_message_to = ref('')

const ip_pool = reactive({
  name: props.ip_pool?.name != null ? props.ip_pool.name : '',
  from: '',
  to: '',
})

if(props.ip_pool?.ranges != null) {
  if(props.ip_pool.ranges.split('/').length !== 2) {
  ip_pool.from = props.ip_pool.ranges.split('-')[0];
  ip_pool.to = props.ip_pool.ranges.split('-')[1];
}else{
  const expoent = Number(props.ip_pool.ranges.split('/')[1]);
  ip_pool.from = props.ip_pool.ranges.split('/')[0]
  ip_pool.to = ip_pool.from.split('.').map((octet, index) => {
    if (index === 3) {
      return Number(octet) + Math.pow(2, 32 - expoent) - 1;
    } 
    return Number(octet)
  }).join('.');
}
} 


function isValidIPv4(ip) {
  const regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return regex.test(ip);
}

const toNumArray = ip => ip.split('.').map(Number);

function isIPv4Greater(ip1, ip2) {

  const a = toNumArray(ip1);
  const b = toNumArray(ip2);

  for (let i = 0; i < 4; i++) {
    if (a[i] < b[i]) return true;
    if (a[i] > b[i]) return false;
  }
  return false; 
}


const insertAddressesPool = async () => {
  try {
    const response = await axios.put('http://localhost:5000/rest/ip/pool', {
      name: ip_pool.name,
      ranges: ip_pool.from + '-' + ip_pool.to,
    }).then(() => {
      getDHCPPools()
      openToast('Adrresses Pool inserted', 'The addresses pool has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting addresses pool', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const updateAddressesPool = async () => {
  try {
    const response = await axios.patch('http://localhost:5000/rest/ip/pool?id=' + props.ip_pool['.id'] , {
      name: ip_pool.name,
      ranges: ip_pool.from + '-' + ip_pool.to,
    }).then(() => {
      getDHCPPools()
      openToast('Adrresses Pool updated', 'The addresses pool has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error updating addresses pool', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const submitForm = () => {
  error_message_name.value = ''
  error_message_from.value = ''
  error_message_to.value = ''
  have_error.value = false

  if (ip_pool.name === '') {
    error_message_name.value = 'Addresses Pool name is required'
    have_error.value = true
  }
   if (ip_pool.from === '') {
    error_message_from.value = 'Starting IP is required'
    have_error.value = true
   }
  if (ip_pool.to === '') {
    error_message_to.value = 'Ending IP is required'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (!isValidIPv4(ip_pool.from)) {
    error_message_from.value = 'Invalid starting IP address'
    have_error.value = true
  }

  if (!isValidIPv4(ip_pool.to)) {
    error_message_to.value = 'Invalid ending IP address'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (ip_pool.from === ip_pool.to) {
    error_message_to.value = 'Starting IP and Ending IP cannot be the same'
    return
  }

  if (!isIPv4Greater(ip_pool.from, ip_pool.to)) {
    error_message_to.value = 'Starting IP cannot be greater than Ending IP'
    return
  }

  if (props.ip_pool?.name != null) {
    updateAddressesPool()
  } else {
    insertAddressesPool()
  }
  emit('closeDialog')
}

</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="ip_pool.name" placeholder="Addresses Pool Name" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_name}} </p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">Starting IP</label>
            <input type="text" name="s_ip" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="ip_pool.from" placeholder="Pool Starting IP Address" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_from}} </p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">Ending IP</label>
            <input type="text" name="e_ip" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="ip_pool.to" placeholder="Pool Ending IP Address" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_to}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>