<script setup>
import { ref, onMounted, inject, reactive } from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  address: {
    type: Object,
    required: false
  }
})

const isLoaded = ref(false)
const INTERFACES_OPTIONS = ref([])
const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getAddresses = inject('getAddresses')

function getInterfaces() {
  return axios.get('http://localhost:5000/rest/interface')
    .then(response => {
      INTERFACES_OPTIONS.value = response.data.map(interfaceIP => {
        return { value: interfaceIP.name, text: interfaceIP.name }
        isLoaded.value = true
      })
    })
    .catch(error => {
      openToast('Error fetching interfaces', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
      emit('closeDialog')
    });
}

const SUBNET_MASK_OPTIONS = [
  { value: '/0', text: '/0' },
  { value: '/1', text: '/1' },
  { value: '/2', text: '/2' },
  { value: '/3', text: '/3' },
  { value: '/4', text: '/4' },
  { value: '/5', text: '/5' },
  { value: '/6', text: '/6' },
  { value: '/7', text: '/7' },
  { value: '/8', text: '/8' },
  { value: '/9', text: '/9' },
  { value: '/10', text: '/10' },
  { value: '/11', text: '/11' },
  { value: '/11', text: '/11' },
  { value: '/12', text: '/12' },
  { value: '/13', text: '/13' },
  { value: '/14', text: '/14' },
  { value: '/15', text: '/15' },
  { value: '/16', text: '/16' },
  { value: '/17', text: '/17' },
  { value: '/18', text: '/18' },
  { value: '/19', text: '/19' },
  { value: '/20', text: '/20' },
  { value: '/21', text: '/21' },
  { value: '/22', text: '/22' },
  { value: '/23', text: '/23' },
  { value: '/24', text: '/24' },
  { value: '/25', text: '/25' },
  { value: '/26', text: '/26' },
  { value: '/27', text: '/27' },
  { value: '/28', text: '/28' },
  { value: '/29', text: '/29' },
  { value: '/30', text: '/30' },
  { value: '/31', text: '/31' },
  { value: '/32', text: '/32' },
]

let have_error = ref(false)
const error_message_address = ref('')
const error_message_interface = ref('')
const address_mask = ref('')
const address = reactive({
  address: props.address ? props.address.address.split('/')[0] : '',
  interface: props.address ? props.address.interface : '',
})

address_mask.value = props.address ? '/' + props.address.address.split('/')[1] : ''

const insertAddress = async () => {
  try {
    const response = await axios.put('http://localhost:5000/rest/ip/address', {
      address: address.address + address_mask.value,
      interface: address.interface
    }).then(() => {
      getAddresses()
      openToast('Address inserted', 'The IP address has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting address', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const updateAddress = async () => {
  try {
    const response = await axios.patch('http://localhost:5000/rest/ip/address?id=' + props.address['.id'], {
      address: address.address + address_mask.value,
      interface: address.interface
    }).then(() => {
      getAddresses()
    openToast('Address updated', 'The IP address has been successfully updated.', 'success')
    })
  } catch (error) {
    openToast('Error updating address', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

function isValidIPv4(ip) {
  const regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return regex.test(ip);
}

const submitForm = () => {
  error_message_address.value = ''
  error_message_interface.value = ''
  have_error.value = false

  if (!isValidIPv4(address.address)) {
    error_message_address.value = 'Invalid destination address'
    have_error.value = true
  }

  if(!have_error.value && address_mask.value == '') {
    error_message_address.value = 'Please select a subnet mask'
    have_error.value = true
  }

  if (address.interface == '') {
    error_message_interface.value = 'Please select a interface'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (props.address != null && props.address != undefined) {
    updateAddress()
  } else {
    insertAddress()
  }
  emit('closeDialog')
}

onMounted(() => {
  isLoaded.value = false
  getInterfaces()
})
</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Address</label>
            <div class="flex">
              <input type="text" name="dst-address" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="address.address" placeholder="Address" />
              <select name="options" class="basis-1/3 w-full mt-2 ms-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="address_mask">
                  <option value="" disabled :selected="props.address?.address != null">SM</option>
                  <option v-for="option in SUBNET_MASK_OPTIONS" :value="option.value">{{ option.text }}</option>
              </select>
            </div>
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_address}} </p>
            </div>
        </div>
        <div class="mb-8">
            <label class="block text-gray-700">Interface</label>
            <select name="options" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="address.interface">
                <option value="" disabled :selected="props.address?.address != null">Select a interface</option>
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