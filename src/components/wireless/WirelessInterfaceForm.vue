<script setup>
import { ref, onMounted, inject, reactive, toRaw } from 'vue'
import axios from 'axios';
import { get } from '@vueuse/core';
const props = defineProps({
  wlan: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getWirelessInterfaces = inject('getWirelessInterfaces')
const SECURITY_PROFILES = ref([])

const wlan = reactive({
  name: props.row_value.name,
  mode : props.row_value.mode,
  ssid: props.row_value.ssid,
  "security-profile": props.row_value["security-profile"],
  "channel-width": props.row_value["channel-width"],
})

const FREQ_2G = [
    {
      value: "2412",
      text: "2412 MHz"
    },
    {
      value: "2417",
      text: "2437 MHz"
    },
    {
      value: "2422",
      text: "2422 MHz"
    },
    {
      value: "2427",
      text: "2427 MHz"
    },
    {
      value: "2432",
      text: "2432 MHz"
    },
    {
      value: "2437",
      text: "2437 MHz"
    },
    {
      value: "2442",
      text: "2442 MHz"
    },
    {
      value: "2447",
      text: "2447 MHz"
    },
    {
      value: "2452",
      text: "2452 MHz"
    },
  ]
const BANDS_5G = [
    {
      value: "5ghz-a",
      text: "5GHz A"
    },
    {
      value: "5ghz-a/n",
      text: "5GHz A/N"
    },
    {
      value: "5ghz-a/n/ac",
      text: "5GHz A/N/AC"
    },
    {
      value: "5ghz-n/ac",
      text: "5GHz N/AC"
    },
    {
      value: "5ghz-onlyac",
      text: "5GHz Only AC"
    },
    {
      value: "5ghz-onlyn",
      text: "5GHz Only N"
    }
  ]

const BANDS_2G = [
    {
      value: "2ghz-b",
      text: "2GHz B"
    },
    {
      value: "2ghz-b/g",
      text: "2GHz B/G"
    },
    {
      value: "2ghz-b/g/n",
      text: "2GHz B/G/N"
    },
    {
      value: "2ghz-g/n",
      text: "2GHz G/N"
    },
    {
      value: "2ghz-onlyg",
      text: "2GHz Only G"
    },
    {
      value: "2ghz-onlyn",
      text: "2GHz Only N"
    }
  ]

const MODES = [
    {
      value: "alignment-only",
      text: "Alignment Only"
    },
    {
      value: "ap-bridge",
      text: "AP Bridge"
    },
    {
      value: "bridge",
      text: "Bridge"
    },
    {
      value: "nstreme-dual-slave",
      text: "Nstreme Dual Slave"
    },
    {
      value: "station",
      text: "Station"
    },
    {
      value: "station-bridge",
      text: "Station Bridge"
    },
    {
      value: "station-pseudobridge",
      text: "Station Pseudobridge"
    },
    {
      value: "station-pseudobridge-clone",
      text: "Station Pseudobridge Clone"
    },
    {
      value: "station-wds",
      text: "Station WDS"
    },
    {
      value: "wds-slave",
      text: "WDS Slave"
    }
  ]

const error_message_ssid = ref('')
const error_message_wpa2 = ref('')
const have_error = ref(false)


const updateWirelessInterface = async () => {
  try {
    const response = await axios.patch('http://localhost:5000/rest/interface/wireless?id=' + props.wlan.id, toRaw(wlan)).then(() => {
    getWirelessInterfaces()
    openToast('Wireless interface updated', 'The wireless interface has been successfully updated.', 'success')
    })
  } catch (error) {
    openToast('Error updating wireless interface', error.message, 'destructive')
  }
}

const getSecurityProfiles = async () => {
  try {
    const response = await axios.get('http://localhost:5000/rest/interface/wireless/security-profiles')
    SECURITY_PROFILES.value = response.data
    SECURITY_PROFILES.value = SECURITY_PROFILES.value.map((profile) => {
     return{
      value: profile.name, 
      text: profile.name
     }
    })
  } catch (error) {
    openToast('Error fetching security profiles', error.message, 'destructive')
    emit('closeDialog')
  }
}

const submitForm = () => {
  error_message_ssid.value = ''
  error_message_wpa2.value = ''
  have_error.value = false

  if (wlan.name === '') {
    error_message_ssid.value = 'Security profile name is required'
    have_error.value = true
  }

  if (wlan['wpa2-pre-shared-key'].length < 8) {
    error_message_wpa2.value = 'Security profile WPA2 key must be at least 8 characters long'
    have_error.value = true
  } else if (wlan['wpa2-pre-shared-key'].length > 64) {
    error_message_wpa2.value = 'Security profile WPA2 key must be at most 64 characters long'
    have_error.value = true
  } else if (wlan['wpa2-pre-shared-key'].includes(' ')) {
    error_message_wpa2.value = 'Security profile WPA2 key must not contain spaces'
    have_error.value = true
  }

  if (have_error.value) {
    return
  }
  
  updateWirelessInterface()  

  emit('closeDialog')

}


onMounted(() => {
  getSecurityProfiles()
})

</script>

<template>
<div class="bg-white p-6 rounded-lg w-full">
    <form @submit.prevent="submitForm" class="space-y-4">
        <div class="mb-4">
            <label class="block text-gray-700">SSID</label>
            <input type="text" name="ssid" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="wlan.ssid" placeholder="Wireless Network SSID" />
            <div>
                <p class="text-sm text-red-700 mt-4">{{error_message_ssid}} </p>
            </div>
        </div>
        <div class="mb-8">
            <label class="block text-gray-700">Mode</label>
            <select name="modes" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="wlan.mode">
                <option v-if="wlan.band.startsWith()" v-for="option in MODES" :value="option.value">{{ option.text }}</option>
            </select>
        </div>
        <div class="mb-8">
            <label class="block text-gray-700">Band</label>
            <select name="modes" class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600" v-model="wlan.mode">
                <option v-for="option in MODES" :value="option.value">{{ option.text }}</option>
            </select>
        </div>
        <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
    </form>
</div>
</template>