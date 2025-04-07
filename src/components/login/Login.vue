<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
    ip: '',
    username: '',
    password: ''
})

const cancel = () => {
    router.back()
}

const login = () => {
    authStore.login(credentials.value)
}
</script>

<template>
  <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Login</CardTitle>
      <CardDescription>Enter your router information</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Router IP</Label>
            <Input id="email" placeholder="0.0.0.0"  v-model="credentials.ip"/>
            <ErrorMessage errorMessage=""></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="email">Username</Label>
            <Input id="email" placeholder="Username"  v-model="credentials.username"/>
            <ErrorMessage errorMessage=""></ErrorMessage>
          </div>
          <div class="flex flex-col space-y-1.5">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="credentials.password"/>
            <ErrorMessage errorMessage=""></ErrorMessage>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="cancel">
            Cancel
        </Button>
        <Button @click="login">
            Login
        </Button>
    </CardFooter>
  </Card>
</template>