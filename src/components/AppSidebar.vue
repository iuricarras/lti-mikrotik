<script setup>
import { Binary, Calendar, ChevronDown, EthernetPort, Home, Inbox, Search, Settings, ShieldUser, Wifi, Workflow, LogOut } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { RouterLink } from "vue-router";
import { useAuthStore } from "./stores/auth";


const authStore = useAuthStore()

// Menu items.
const items = [
  {
    title: "Interfaces",
    url: "interfaces",
    icon: EthernetPort,
  },
  {
    title: "Bridge",
    url: "bridges",
    icon: Workflow,
  },
  {
    title: "Wireless",
    url: "wireless",
    icon: Wifi,
  },
  {
    title: "IP",
    url: "",
    icon: Binary,
  },
  {
    title: "WireGuard",
    url: "wireguard",
    icon: ShieldUser,
  },
];

const ip_items = [
  {
    title: "Routes",
    url: "/ip/routes"
  },
  {
    title: "Addresses",
    url: "/ip/addresses"
  },
  {
    title: "DHCP",
    url: "/ip/dhcp"
  },
  {
    title: "DNS Server",
    url: "/ip/dns"
  },
]

const logout = () => {
  authStore.logout()
}

</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel class="mb-4">SDN Controller - Mikrotik</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <Collapsible defaultOpen class="group/collapsible">
              <SidebarMenuItem v-for="item in items" :key="item.title" class="m-1">
                <CollapsibleTrigger v-if="item.title == 'IP'" asChild>
                  <div class="flex">
                    <SidebarMenuButton asChild>
                      <RouterLink :to="{ name: item.url }">
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                        <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                          asChild />
                      </RouterLink>
                    </SidebarMenuButton>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent v-if="item.title == 'IP'">
                  <SidebarMenuSub>
                    <SidebarMenuSubItem v-for="item_ip in ip_items">
                      <SidebarMenuSubButton>
                        <a :href="item_ip.url">
                          <span>{{ item_ip.title }}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
                <SidebarMenuButton v-if="item.title != 'IP'" asChild>
                  <RouterLink :to="{ name: item.url }">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <div class="mt-auto p-4 border-t">
      <div class="flex items-center justify-between space-x-4">
        <div>
          <p class="text-sm text-gray-500">Router IP: <span class="font-semibold">{{ authStore.ip }}</span></p>
          <p class="text-sm text-gray-500">Username: <span class="font-semibold">{{ authStore.user }}</span></p>
        </div>
        <Button variant="outline" class="text-s px-2 py-1" @click="logout" alt-title="Logout">
          <LogOut class="w-4 h-4" />
        </Button>
      </div>
    </div>
  </Sidebar>
</template>