import axios from "axios"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const user = ref(null)
    const ip = ref(null)

    const login = async (credentials) => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                ip: credentials.ip,
                username: credentials.username,
                password: credentials.password
            })
            user.value = credentials.username
            ip.value = credentials.ip
            let lastLoginList = localStorage.getItem('lastlogin')
            if (lastLoginList) {
                lastLoginList = JSON.parse(lastLoginList)
            } else {
                lastLoginList = []
            }
            for (let i = 0; i < lastLoginList.length; i++) {
                if (lastLoginList[i].ip === credentials.ip && lastLoginList[i].username === credentials.username) {
                    lastLoginList.splice(i, 1)
                    break
                }
            }

            if (lastLoginList.length >= 5) {
                lastLoginList.shift()
            }

            lastLoginList.push({ ip: ip.value, username: user.value })

            localStorage.setItem('lastLoginList', JSON.stringify(lastLoginList))

            sessionStorage.setItem("lastLogin", JSON.stringify({ ip: ip.value, username: user.value }))

            router.push({ name: 'home' })
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        }
    }

    const restoreLogin = () => {
        const lastLogin = sessionStorage.getItem("lastLogin")
        if (lastLogin) {
            const { ip: storedIp, username } = JSON.parse(lastLogin)
            ip.value = storedIp
            user.value = username
        }
    }

    return { ip, login, restoreLogin} 
})