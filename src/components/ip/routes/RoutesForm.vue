<script setup>
import { ref, onMounted, inject, reactive } from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  route: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getRoutes = inject('getRoutes')
const GATEWAYS = ref([])

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
const error_message_dst_address = ref('')
const error_message_gateway = ref('')
const isLoaded = ref(false)
const dst_mask = ref('')
const route = reactive({
  dst_address: props.route ? props.route.dst_address.split('/')[0] : '',
  gateway: props.route ? props.route.gateway : '',
})

dst_mask.value = props.route ? '/' + props.route.dst_address.split('/')[1] : ''

const insertRoute = async () => {
  try {
    const response = await axios.put('http://localhost:5000/rest/ip/route', {
      "dst-address": route.dst_address + dst_mask.value,
      gateway: route.gateway
    }).then(() => {
      getRoutes()
      openToast('Route inserted', 'The IP route has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting route', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

const updateRoute = async () => {
  try {
    const response = await axios.patch('http://localhost:5000/rest/ip/route?id=' + props.route['.id'], {
      "dst-address": route.dst_address + dst_mask.value,
      gateway: route.gateway
    }).then(() => {
      getRoutes()
    openToast('Route updated', 'The IP route has been successfully updated.', 'success')
    })
  } catch (error) {
    openToast('Error updating route', error?.response?.data?.detail != null ? error.response.data.detail : error.message, 'destructive')
  }
}

function isValidIPv4(ip) {
  const regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  return regex.test(ip);
}

const submitForm = () => {
  error_message_dst_address.value = ''
  error_message_gateway.value = ''
  have_error.value = false

  if (!isValidIPv4(route.dst_address)) {
    error_message_dst_address.value = 'Invalid destination address'
    have_error.value = true
  }

  if(!have_error.value && dst_mask.value == '') {
    error_message_dst_address.value = 'Please select a subnet mask'
    have_error.value = true
  }

  if (!isValidIPv4(route.gateway)) {
    error_message_gateway.value = 'Invalid gateway address'
    have_error.value = true
  }

  if(have_error.value) {
    return
  }

  if (props.route != null && props.route != undefined) {
    updateRoute()
  } else {
    insertRoute()
  }
  emit('closeDialog')
}

</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Destination Address</label>
            <div class="flex">
              <input type="text" name="dst-address" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="route.dst_address" placeholder="Destination Address" />
              <select name="options" class="basis-1/3 w-full mt-2 ms-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="dst_mask">
                  <option value="" disabled :selected="route.dst_address == ''">SM</option>
                  <option v-for="option in SUBNET_MASK_OPTIONS" :value="option.value">{{ option.text }}</option>
              </select>
            </div>
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_dst_address}} </p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700">Gateway</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="route.gateway" placeholder="Gateway" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_gateway}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>