<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import axios from 'axios';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { useFilter } from 'reka-ui'

const props = defineProps({
    interfaces: {
        type: Object,
        required: false
    }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getInterfaces = inject('getInterfaces')
let interface_name = ref('')
let interface_ip = ref('')
let interface_listen = ref('')

const error_message_name = ref('')
const error_message_listen = ref('')
const error_message_ip = ref('')

const insertInterface = async () => {
    try {
        const response = await axios.put('/rest/interface/wireguard', {
            name: interface_name.value,
            'listen-port': interface_listen.value
        }).then(async () => {
            await axios.put('/rest/ip/address', {
                address: interface_ip.value + '/24',
                interface: interface_name.value
            }).then(() => {
                getInterfaces()
                openToast('Interface created', 'The interface was created successfully', 'success')
            })
        })
    } catch (error) {
        openToast('Error creating Interface:', error, 'destructive')
    }
}

function validateIPaddress(ipaddress) {  
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
    return (true)  
  }   
  return (false)  
}  

const submitForm = () => {
    error_message_name.value = ''
    error_message_listen.value = ''
    error_message_ip.value = ''

    if (interface_name.value === '') {
        error_message_name.value = 'Interface name is required'
        return
    }

    if (interface_ip.value === '') {
        error_message_ip.value = 'Interface address is required'
        return
    }
    if (!validateIPaddress(interface_ip.value)) {
        error_message_ip.value = 'Invalid IP address'
        return
    }

    if (interface_listen.value === '') {
        error_message_listen.value = 'Interface listen port is required'
        return
    }
    if (isNaN(interface_listen.value)) {
        error_message_listen.value = 'Interface listen port must be a number'
        return
    }
    if (interface_listen.value < 1024 || interface_listen.value > 65535) {
        error_message_listen.value = 'Interface listen port must be between 1024 and 65535'
        return
    }

    insertInterface()
    emit('closeDialog')
}


</script>

<template>
    <div class="bg-white p-6 rounded-lg w-full">
        <form @submit.prevent="submitForm" class="space-y-4">
            <div class="mb-4">
                <label class="block text-gray-700">Name</label>
                <input type="text" name="name"
                    class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    v-model="interface_name" placeholder="Interface Name" />
                <div>
                    <p class="text-sm text-red-700 mt-4">{{ error_message_name }} </p>
                </div>
            </div>
            <div class="mb-8">
                <label class="block text-gray-700">Interface IP Address</label>
                <input type="text" name="ip"
                    class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    v-model="interface_ip" placeholder="Interface IP" />
                <div v-show="error_message_ip">
                    <p class="text-sm text-red-700 mt-4">{{ error_message_ip}} </p>
                </div>
            </div>
            <div class="mb-8">
                <label class="block text-gray-700">Interface Listen Port</label>
                <input type="text" name="listen"
                    class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    v-model="interface_listen" placeholder="Listen Port" />
                <div v-show="error_message_listen">
                    <p class="text-sm text-red-700 mt-4">{{ error_message_listen}} </p>
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
        </form>
    </div>
</template>