<script setup>
import { ref, onMounted, inject, reactive, toRaw } from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  security_profile: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getSecurityProfiles = inject('getSecurityProfiles')

const security_profile = reactive({
  name: props.security_profile?.name ? props.security_profile.name : '',
  mode: "dynamic-keys",
  "authentication-types": 'wpa2-psk',
  "wpa2-pre-shared-key": props.security_profile != undefined ? props.security_profile["wpa2-pre-shared-key"] : '',
})

const error_message_name = ref('')
const error_message_wpa2 = ref('')
const have_error = ref(false)





const insertSecurityProfile = async () => {
  try {
    const response = await axios.put('http://localhost:5000/rest/interface/wireless/security-profiles', toRaw(security_profile)).then(() => {
      getSecurityProfiles()
      openToast('Security Profile inserted', 'The security profile has been successfully created.', 'success')
    })
  } catch (error) {
    openToast('Error inserting the security profile', error.response.data.detail ? error.response.data.detail : error.statusText, 'destructive')
  }
}

const updateSecurityProfile = async () => {
  try {
    const response = await axios.patch('http://localhost:5000/rest/interface/wireless/security-profiles?id=' + props.security_profile.id, toRaw(security_profile)).then(() => {
    getSecurityProfiles()
    openToast('Security Profile updated', 'The security profile has been successfully updated.', 'success')
    })
  } catch (error) {
    openToast('Error updating security profile', error.response.data.detail ? error.response.data.detail : error.statusText, 'destructive')
  }
}

const submitForm = () => {
  error_message_name.value = ''
  error_message_wpa2.value = ''
  have_error.value = false

  if (security_profile.name === '') {
    error_message_name.value = 'Security profile name is required'
    have_error.value = true
  }

  if (security_profile['wpa2-pre-shared-key'].length < 8) {
    error_message_wpa2.value = 'Security profile WPA2 key must be at least 8 characters long'
    have_error.value = true
  } else if (security_profile['wpa2-pre-shared-key'].length > 64) {
    error_message_wpa2.value = 'Security profile WPA2 key must be at most 64 characters long'
    have_error.value = true
  } else if (security_profile['wpa2-pre-shared-key'].includes(' ')) {
    error_message_wpa2.value = 'Security profile WPA2 key must not contain spaces'
    have_error.value = true
  }

  if (have_error.value) {
    return
  }

  if (props.security_profile !== undefined) {
    updateSecurityProfile()
  } else {
    insertSecurityProfile()
  }
  emit('closeDialog')
}


</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">Name</label>
            <input type="text" name="name" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="security_profile.name" placeholder="Security profile name" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_name}} </p>
            </div>
        </div>
        <div class="mb-8">
            <label class="block text-gray-700">WPA2 Key</label>
            <input type="password" name="password" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="security_profile['wpa2-pre-shared-key']" placeholder="Security profile WPA2 key"/>
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_wpa2}} </p>
            </div>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>