<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  bridge: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getBridges = inject('getBridges')
let bridge_name = ref('')
let bridge_arp = ref('')
let bridge_id = ref('')

const ARP_OPTIONS = [
  { value: 'enabled', text: 'Enabled' },
  { value: 'disabled', text: 'Disabled' },
  { value: 'local-proxy-arp', text: 'Local Proxy ARP' },
  { value: 'proxy-arp', text: 'Proxy ARP' },
  { value: 'replay-only', text: 'Replay Only' }
]

let have_error = ref(false)
const error_message_name = ref('')
const error_message_arp = ref('')

bridge_id.value = props.bridge?.id ? props.bridge.id : ''
bridge_name.value = props.bridge?.name ? props.bridge.name : ''
bridge_arp.value = props.bridge?.arp ? props.bridge.arp : ''



const insertBridge = async () => {
  try {
    const response = await axios.put('http://localhost:5000/rest/interface/bridge', {
      name: bridge_name.value,
      arp: bridge_arp.value
    }).then(() => {
      getBridges()
      openToast('Bridge inserted', 'The bridge interface has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting bridge', error.message, 'destructive')
  }
}

const updateBridge = async () => {

  if (bridge_name.value == 'bridge1') {
    openToast('Error updating bridge1', 'bridge1 is not updatable', 'destructive')
    return
  }
  try {
    const response = await axios.patch('http://localhost:5000/rest/interface/bridge?id=' + bridge_id.value, {
      name: bridge_name.value,
      arp: bridge_arp.value
    }).then(() => {
      getBridges()
    openToast('Bridge updated', 'The bridge interface has been successfully updated.', 'success')
    })
  } catch (error) {
    openToast('Error updating bridge', error.message, 'destructive')
  }
}

const submitForm = () => {
  error_message_name.value = ''
  error_message_arp.value = ''
  have_error.value = false

  if (bridge_name.value === '') {
    error_message_name.value = 'Bridge name is required'
    have_error.value = true
  }

  if (bridge_arp.value === '') {
    error_message_arp.value = 'ARP type is required'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (bridge_id.value) {
    updateBridge()
  } else {
    insertBridge()
  }
  emit('closeDialog')
}

</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="bridge_name" placeholder="Bridge Name" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_name}} </p>
            </div>
        </div>
        <div class="mb-8">
            <label class="block text-gray-700">ARP Type</label>
            <select name="options" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="bridge_arp">
                <option value="" disabled :selected="bridge_name == ''">Select a ARP Type</option>
                <option v-for="option in ARP_OPTIONS" :value="option.value">{{ option.text }}</option>
            </select>
            <div v-show="error_message_arp">
                <p class="text-sm text-red-700 mt-4">{{error_message_arp}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>