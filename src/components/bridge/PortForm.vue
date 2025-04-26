<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';

const props = defineProps({
  port: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getAllPorts = inject('getAllPorts')
let port_interface = ref('')
let port_bridge = ref('')

const getBridgesInfo = () =>{
  axios.get('/rest/interface/bridge')
    .then(response => {
      let bridges = response.data;
      bridges.forEach(element => {
        BRIDGE_OPTIONS.value.push({
          value: element['.id'],
          text: element.name
        })
      })
    }).catch(error => {
      return;
    });
}


const BRIDGE_OPTIONS = ref([])


const error_message_bridge = ref('')

port_interface.value = props.port.interface 
port_bridge.value = props.port.bridge == 'none' ? '' : props.port.bridge



const insertPortToBridge = async () => {
  if(port_interface.value === 'ether1' || port_interface.value === 'ether2'){ 
    openToast('Error inserting bridge', 'You must select a valid port for this bridge interface', 'destructive')
    return
  }
  try {
    const response = await axios.put('/rest/interface/bridge/port', {
      interface: port_interface.value,
      bridge: port_bridge.value
    }).then(() => {
      getAllPorts()
      openToast('Bridge inserted', 'The bridge interface has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting bridge', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const submitForm = () => {
  error_message_bridge.value = ''

  if (port_bridge.value === '') {
    error_message_arp.value = 'You must select a bridge to associate with this port'
    return
  }
    insertPortToBridge()
  emit('closeDialog')
}

onMounted(() => {
  getBridgesInfo()
})
</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Interface</label>
            <input type="text" name="name" disabled class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="port_interface"/>

        </div>
        <div class="mb-8">
            <label class="block text-gray-700">Bridge</label>
            <select name="options" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="port_bridge">
                <option value="" disabled :selected="port_bridge == ''">Select a Bridge</option>
                <option v-for="option in BRIDGE_OPTIONS" :value="option.value">{{ option.text }}</option>
            </select>
            <div v-show="error_message_bridge">
                <p class="text-sm text-red-700 mt-4">{{error_message_bridge}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>