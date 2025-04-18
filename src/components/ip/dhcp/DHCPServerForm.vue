<script setup>
import { ref, onMounted, inject, reactive } from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  dhcp_server: {
    type: Object,
    required: false
  }
})
const IP_POOLS_OPTIONS = ref([])
const INTERFACES_OPTIONS = ref([])
const isLoaded = ref(false)

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getDHCPServers = inject('getDHCPServers')

function getIPPools() {
  axios.get('http://localhost:5000/rest/ip/pool')
    .then(response => {
      IP_POOLS_OPTIONS.value = response.data.map(pool => ({
        value: pool.name,
        text: pool.name,
      }))
      isLoaded.value = true
    })
    .catch(error => {
      openToast('Error fetching addresses pools', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
      emit('closeDialog')
    })
}

function getInterfaces() {
  axios.get('http://localhost:5000/rest/interface')
    .then(response => {
      INTERFACES_OPTIONS.value = response.data.map(interfaceIP => ({
        value: interfaceIP.name,
        text: interfaceIP.name,
      }))
      isLoaded.value = true
    })
    .catch(error => {
      openToast('Error fetching interfaces', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
      emit('closeDialog')
    })
}

let have_error = ref(false)
const error_message_name = ref('')
const error_message_addresses_pool = ref('')
const error_message_interface = ref('')

const dhcp_server = reactive({
  name: props.dhcp_server ? props.dhcp_server.name : "",
  'address-pool': props.dhcp_server ? props.dhcp_server['address-pool'] : "",
  interface: props.dhcp_server ? props.dhcp_server['interface'] : "",
  'lease-time': "30m",
})


const insertDHCPServer = async () => {
  try {
    const response = await axios.put('http://localhost:5000/rest/ip/dhcp-server', dhcp_server).then(() => {
      getDHCPServers()
      openToast('DHCP Server inserted', 'The DHCP server has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting DHCP server', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const updateDHCPServer = async () => {
  try {
    const response = await axios.patch('http://localhost:5000/rest/ip/dhcp-server?id=' + props.dhcp_server['.id'], dhcp_server).then(() => {
    getDHCPServers()
    openToast('DHCP server updated', 'The DHCP server has been successfully updated.', 'success')
    })
  } catch (error) {
    openToast('Error updating DHCP server', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const submitForm = () => {
  error_message_name.value = ''
  error_message_addresses_pool.value = ''
  error_message_interface.value = ''
  have_error.value = false

  if (dhcp_server.name === '') {
    error_message_name.value = 'DHCP server name is required'
    have_error.value = true
  }

  if (dhcp_server['address-pool'] === '') {
    error_message_addresses_pool.value = 'Address pool is required'
    have_error.value = true
  }

  if (dhcp_server.interface === '') {
    error_message_interface.value = 'Interface is required'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (props.dhcp_server != null  && props.dhcp_server != undefined) {
    updateDHCPServer()
  } else {
    insertDHCPServer()
  }
  emit('closeDialog')
}

onMounted(() => {
  getIPPools()
  getInterfaces()
})

</script>

<template>
<div v-if="isLoaded" class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="dhcp_server.name" placeholder="Bridge Name" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_name}} </p>
            </div>
        </div>
        <div class="mb-8">
            <label class="block text-gray-700">Addresses Pool</label>
            <select name="options" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="dhcp_server['address-pool']">
                <option value="" disabled :selected="dhcp_server.name != null">Select an Address Pool</option>
                <option v-for="option in IP_POOLS_OPTIONS" :value="option.value">{{ option.text }}</option>
            </select>
            <div v-show="error_message_addresses_pool">
                <p class="text-sm text-red-700 mt-4">{{error_message_addresses_pool}} </p>
            </div>
        </div>
        <div class="mb-8">
            <label class="block text-gray-700">Interface</label>
            <select name="options" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="dhcp_server.interface">
                <option value="" disabled :selected="dhcp_server.name != null">Select an Interface</option>
                <option v-for="option in INTERFACES_OPTIONS" :value="option.value">{{ option.text }}</option>
            </select>
            <div v-show="error_message_interface">
                <p class="text-sm text-red-700 mt-4">{{error_message_interface}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>