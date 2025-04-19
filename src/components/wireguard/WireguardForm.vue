<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import axios from 'axios';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { useFilter } from 'reka-ui'

const props = defineProps({
    peer: {
        type: Object,
        required: false
    },
    peers: {
        type: Array,
        required: false
    }
})

const emit = defineEmits(['closeDialog'])
const openToast = inject('openToast')
const getPeers = inject('getPeers')
let peer_name = ref('')
let peer_addresses = ref([])
let peer_allowed = ref([])
let peer_id = ref('')

const open = ref(false)
const searchTerm = ref('')

const error_message_name = ref('')
const error_message_addresses = ref('')
const error_message_allowed = ref('')

peer_id.value = props.peer ? props.peer['.id'] : ''
peer_name.value = props.peer ? props.peer.name : ''
peer_addresses.value = props.peer ? props.peer['client-address'].split(',') : [] //Editar isto 
peer_allowed.value = props.peer ? props.peer['allowed-address'].split(',') : ['::/0']//Editar isto

const ips = []

const insertPeer = async () => {
    try {
        const response = await axios.put('http://localhost:5000/rest/interface/wireguard/peers', {
            name: peer_name.value,
            'client-address': peer_addresses.value.join(','),
            'allowed-address': peer_allowed.value.join(','),
            'private-key': 'auto',
            'interface': props.peers[0]['interface'],
        }).then(() => {
            getPeers()
            openToast('Peer created', 'The peer was created successfully', 'success')
        })
    } catch (error) {
        openToast('Error creating peer:', error, 'destructive')
    }
}

const updatePeer = async () => {
    try {
        const response = await axios.patch('http://localhost:5000/rest/interface/wireguard/peers?id=' + peer_id.value, {
            name: peer_name.value,
            'client-address': peer_addresses.value.join(','),
            'allowed-address': peer_allowed.value.join(','),
        }).then(() => {
            getPeers()
            openToast('Peer updated', 'The peer was updated successfully', 'success')
        })
    } catch (error) {
        openToast('Error updating peer:', error, 'destructive')
    }
}

const submitForm = () => {
    error_message_name.value = ''
    error_message_addresses.value = ''

    if (peer_name.value === '') {
        error_message_name.value = 'Peer name is required'
        return
    }
    console.log(peer_addresses.value)
    if (peer_addresses.value.length === 0) {
        error_message_addresses.value = 'At least one address is required'
        return
    }
    peer_addresses.value.forEach((address, index) => {
        if (!address.endsWith('/32')) {
            peer_addresses.value[index] = `${address}/32`;
        }
    });

    if (peer_allowed.value.length === 0) {
        error_message_allowed.value = 'At least one address is required'
        return
    }

    if (peer_id.value) {
        updatePeer()
    } else {
        insertPeer()
    }
    emit('closeDialog')
}

const { contains } = useFilter({ sensitivity: 'base' })
const filteredIps = computed(() => {
    const options = ips.filter(i => !peer_addresses.value.includes(i.label))
    return searchTerm.value ? options.filter(option => contains(option.label, searchTerm.value)).splice(0, 5) : options
})

onMounted(() => {
    for (let i = 2; i < 255; i++) {
        const ipToCheck = '10.100.0.' + i;
        let exists = false;

        if (props.peers) {
            props.peers.forEach(peer => {
                peer['client-address'].split(',').forEach(ip => {
                    const trimmedIp = ip.split('/')[0].trim();
                    if (trimmedIp === ipToCheck) {
                        exists = true;
                    }
                });
            });
        }

        if (!exists) {
            ips.push({ label: ipToCheck, value: ipToCheck });
        }
    }
})

</script>

<template>
    <div class="bg-white p-6 rounded-lg w-full">
        <form @submit.prevent="submitForm" class="space-y-4">
            <div class="mb-4">
                <label class="block text-gray-700">Name</label>
                <input type="text" name="name"
                    class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    v-model="peer_name" placeholder="Peer Name" />
                <div>
                    <p class="text-sm text-red-700 mt-4">{{ error_message_name }} </p>
                </div>
            </div>
            <div class="mb-8">
                <label class="block text-gray-700">Peer IP</label>
                <Combobox v-model="peer_addresses" v-model:open="open" :ignore-filter="true">
                    <ComboboxAnchor as-child>
                        <TagsInput v-model="peer_addresses"
                            class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                            <div class="flex gap-2 flex-wrap items-center">
                                <TagsInputItem v-for="item in peer_addresses" :key="item" :value="item">
                                    <TagsInputItemText />
                                    <TagsInputItemDelete />
                                </TagsInputItem>
                            </div>

                            <ComboboxInput v-model="searchTerm" as-child>
                                <TagsInputInput placeholder="IP Address..."
                                    class="min-w-[200px] w-full p-0 border-none focus-visible:ring-0 h-auto"
                                    @keydown.enter.prevent />
                            </ComboboxInput>
                        </TagsInput>

                        <ComboboxList class="w-[--reka-popper-anchor-width]">
                            <ComboboxEmpty />
                            <ComboboxGroup>
                                <ComboboxItem v-for="ip in filteredIps" :key="ip.value" :value="ip.label"
                                    @select.prevent="(ev) => {

                                        if (typeof ev.detail.value === 'string') {
                                            searchTerm = ''
                                            peer_addresses.push(ev.detail.value)
                                        }

                                        if (filteredIps.length === 0) {
                                            open = false
                                        }
                                    }">
                                    {{ ip.label }}
                                </ComboboxItem>
                            </ComboboxGroup>
                        </ComboboxList>
                    </ComboboxAnchor>
                </Combobox>
                <div v-show="error_message_addresses">
                    <p class="text-sm text-red-700 mt-4">{{ error_message_addresses }} </p>
                </div>
            </div>
            <div class="mb-8">
                <label class="block text-gray-700">Allowed IPs</label>
                <TagsInput v-model="peer_allowed"
                    class="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600">
                    <TagsInputItem v-for="item in peer_allowed" :key="item" :value="item">
                        <TagsInputItemText />
                        <TagsInputItemDelete />
                    </TagsInputItem>

                    <TagsInputInput placeholder="IPs Addresses" />
                </TagsInput>
                <div v-show="error_message_allowed">
                    <p class="text-sm text-red-700 mt-4">{{ error_message_allowed }} </p>
                </div>
            </div>
            <button type="submit" class="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black">Confirm</button>
        </form>
    </div>
</template>