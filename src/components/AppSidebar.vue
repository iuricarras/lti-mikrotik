<script setup lang="ts">
import { Binary, Calendar, EthernetPort, Home, Inbox, Search, Settings, ShieldUser, Wifi, Workflow } from "lucide-vue-next"
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

// Menu items.
const items = [
  {
    title: "Interfaces",
    url: "#",
    icon: EthernetPort,
  },
  {
    title: "Bridge",
    url: "#",
    icon: Workflow,
  },
  {
    title: "Wireless",
    url: "#",
    icon: Wifi,
  },
  {
    title: "IP",
    url: "#",
    icon: Binary,
  },
  {
    title: "WireGuard",
    url: "#",
    icon: ShieldUser,
  },
];

const ip_items = [
  {
    title: "Routes",
    url: "#"
  },
  {
    title: "Addresses",
    url: "#"
  },
  {
    title: "Routes",
    url: "#"
  },
  {
    title: "DHCP Server",
    url: "#"
  },
  {
    title: "DNS Server",
    url: "#"
  },
]
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
                        <a :href="item.url">
                        <component :is="item.icon" />
                        <span>{{item.title}}</span>
                        </a>
                        <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" asChild/>
                    </SidebarMenuButton>
                </div>
                </CollapsibleTrigger>
                <CollapsibleContent v-if="item.title == 'IP'">
                    <SidebarMenuSub>
                        <SidebarMenuSubItem v-for="item_ip in ip_items">
                          <SidebarMenuSubButton>
                            <a :href="item_ip.url">
                              <span>{{item_ip.title}}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </CollapsibleContent>
                <SidebarMenuButton v-if="item.title != 'IP'" asChild>
                    <a :href="item.url">
                      <component :is="item.icon" />
                      <span>{{item.title}}</span>
                    </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>