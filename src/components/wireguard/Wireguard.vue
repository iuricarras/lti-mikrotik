<script setup>
import axios from 'axios';
import { onMounted, provide, ref } from 'vue';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Button from '../ui/button/Button.vue';
import { MoreHorizontal } from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator'
import { saveAs } from 'file-saver';
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { shallowRef } from 'vue'
import { CirclePlus } from 'lucide-vue-next';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { inject } from 'vue';
import WireguardForm from './WireguardForm.vue';
import Table from '../tables/Table.vue';
import { ColumnsInterface } from './columns_interface';
import WireguardInterfaceForm from './WireguardInterfaceForm.vue';

const peers = ref([]);
const interfaces = ref([]);
const peersExists = ref(false);
const isInterface = ref(true);

const qrcodeData = shallowRef('');
const qrcode = useQRCode(qrcodeData)
const isDialogOpen = ref(false)
var alertDialog = inject('alertDialog')

var peerIDDeleting = '';

const closeDialog = () => {
  isDialogOpen.value = false
}


const getInterfaces = async () => {
    // Fetch interfaces from the server
    await axios.get('/rest/interface/wireguard')
        .then(response => {
            interfaces.value = response.data;
            isInterface.value = true;
            console.log('Fetched interfaces:', interfaces.value);
        })
        .catch(error => {
            console.error('Error fetching interfaces:', error);
        });
};

const getPeers = async () => {
    // Fetch peers from the server
    await axios.get('/rest/interface/wireguard/peers')
        .then(response => {
            peers.value = response.data;
            peersExists.value = peers.value.length > 0;
            isInterface.value = false;
            console.log('Fetched peers:', peers.value);
        })
        .catch(error => {
            console.error('Error fetching peers:', error);
        });
};

const tooglePeer = (peerID, status) => {
    // Disable the peer
    axios.patch('/rest/interface/wireguard/peers?id=' + peerID, {
        "disabled": status == "true" ? "false" : "true"
    })
        .then(response => {
            console.log('Peer disabled:', response.data);
            getPeers(); // Refresh the list of peers
        })
        .catch(error => {
            console.error('Error disabling peer:', error);
        });
};

const downloadQRCode = (configID) => {
    axios.post('/rest/interface/wireguard/peers/show-client-config', {
        ".id": configID
    })
        .then(response => {
            console.log('Config response:', response.data);
            const responseData = response.data;
            qrcodeData.value = responseData[0].conf;
        })
        .catch(error => {
            console.error('Error downloading config:', error);
        });
};

const downloadConfig = (configID) => {
    console.log(configID)
    axios.post('/rest/interface/wireguard/peers/show-client-config', {
        ".id": configID
    })
        .then(response => {
            console.log('Config response:', response.data);
            const responseData = response.data;
            const blob = new Blob([responseData[0].conf], { type: 'text/plain' });
            saveAs(blob, `wireguard-config-${configID}.conf`);
        })
        .catch(error => {
            console.error('Error downloading config:', error);
        });
};

function deleteConfirmed() {
    axios.delete('/rest/interface/wireguard/peers?id=' + peerIDDeleting)
        .then(response => {
            console.log('Peer deleted:', response.data);
            getPeers(); // Refresh the list of peers
        })
        .catch(error => {
            console.error('Error deleting peer:', error);
        });
}


function deletePeer(peerID) {
    peerIDDeleting = peerID;
    alertDialog.value.open(
        deleteConfirmed,
        'Do you really want to delete this wireguard peer ?', 'Cancel', 'Yes',
        'If you delete it you may lost the connection to this router depending on your configuration')
}

provide('getPeers', getPeers);
provide('getInterfaces', getInterfaces);


onMounted(async () => {
    await getInterfaces();
})
</script>

<template>
    <div class="pl-12 pt-12 pr-10 w-full h-screen">
        <h1 class="text-4xl mb-12">WireGuard</h1>
        <div class="flex space-x-3 border-none text-base">
            <button
                class=" h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
                :class="{ 'bg-gray-800 hover:bg-gray-800': isInterface }" @click="getInterfaces()">
                <div class="px-4">Interfaces</div>
            </button>
            <button
                class="h-10  text-center rounded-lg border-none text-white select-none bg-gray-400 cursor-pointer transition hover:bg-gray-500"
                :class="{ 'bg-gray-800 hover:bg-gray-800': !isInterface }" @click="getPeers()">
                <div class="px-4">Peers</div>
            </button>
            <div v-if="isInterface" class="w-full h-10 flex justify-end">
                <Dialog v-model:open="isDialogOpen">
                    <DialogTrigger>
                        <div class="flex cursor-pointer">
                            <component :is="CirclePlus" class="mr-2 h-5" />
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create WireGuard Interface</DialogTitle>
                            <DialogDescription>
                                Create a new WireGuard interface
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <WireguardInterfaceForm @close-dialog="closeDialog" :peers="peers"  />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div v-else class="w-full h-10 flex justify-end">
                <Dialog v-model:open="isDialogOpen">
                    <DialogTrigger>
                        <div class="flex cursor-pointer">
                            <component :is="CirclePlus" class="mr-2 h-5" />
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Peer</DialogTitle>
                            <DialogDescription>
                                Configure a new Peer
                            </DialogDescription>
                        </DialogHeader>
                        <div>
                            <WireguardForm @close-dialog="closeDialog" :peers="peers" :interfaces="interfaces" />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        <div v-if="isInterface" class="w-full mt-12">
            <Table :data="interfaces" :columns="ColumnsInterface" />
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 auto-rows-fr">
            <div v-if="peersExists" v-for="peer in peers" :key="peer.id"
                class="p-4 border rounded shadow flex flex-col h-full"
                :class="{ 'bg-gray-100': peer['disabled'] == 'true' }">
                <p class="text-lg font-semibold">Name: {{ peer.name }}</p>
                <div class="text-sm text-gray-600">
                    <p class="font-semibold">IP Allocation:</p>
                    <ul class="list-disc list-inside">
                        <li v-for="ip in peer['client-address'].split(',')" :key="ip">
                            {{ ip }}
                        </li>
                    </ul>
                    <p class="font-semibold">Interface: {{ peer.interface }}</p>
                </div>

                <!-- Push separator and buttons to the bottom -->
                <div class="mt-auto">
                    <Separator label="Options" class="mt-4" />
                    <div class="flex justify-between items-center mt-4">
                        <div class="flex space-x-2">
                            <!-- Reduced size buttons -->
                            <button class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                                @click="downloadConfig(peer['.id'])">Download</button>

                            <Dialog>
                                <DialogTrigger>
                                    <button class="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                                        @click="downloadQRCode(peer['.id'])">QR Code</button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>QR Code</DialogTitle>
                                        <DialogDescription>
                                            Scan the QR Code using your mobile device to connect to the VPN.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div class="flex justify-center">
                                        <img v-if="qrcodeData" :src="qrcode" alt="QR Code" class="w-64 h-64" />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <!-- Dropdown -->
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" class="w-8 h-8 p-0">
                                        <span class="sr-only">Open menu</span>
                                        <MoreHorizontal class="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem @click="">Edit</DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuItem @click="tooglePeer(peer['.id'], peer['disabled'])">Disable
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @click="deletePeer(peer['.id'])">Remove</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Peer</DialogTitle>
                                    <DialogDescription>
                                        Configure a new Peer
                                    </DialogDescription>
                                </DialogHeader>
                                <div>
                                    <WireguardForm @close-dialog="closeDialog" :peers="peers" :peer="peer" :interfaces="interfaces" />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
            <div v-else class="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 p-4 border rounded shadow">
                <p class="text-lg font-semibold">No peers found</p>
            </div>
        </div>
    </div>
</template>