import axios from "axios"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const user = ref(null)
    const ip = ref(null)
    const loginList = ref([])

    const login = async (credentials) => {
        try {
            const response = await axios.post('/login', {
                ip: credentials.ip,
                username: credentials.username,
                password: credentials.password
            })
            user.value = credentials.username
            ip.value = credentials.ip
            let lastLoginList = localStorage.getItem('lastLoginList')
            console.log("lastLoginList", lastLoginList)
            if (lastLoginList)  {
                lastLoginList = JSON.parse(lastLoginList)
                console.log("lastLoginList", lastLoginList)
            } else {
                lastLoginList = []
                console.log("lastLoginList is empty")
            }
            for (let i = 0; i < lastLoginList.length; i++) {
                if (lastLoginList[i].ip === credentials.ip && lastLoginList[i].username === credentials.username) {
                    lastLoginList.splice(i, 1)
                    console.log("Removing duplicate login entry")
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

    const restoreLogin = async () => {
        const lastLogin = sessionStorage.getItem("lastLogin")
        if (lastLogin) {
            const { ip: storedIp, username } = JSON.parse(lastLogin)
            await axios.post('/autoLogin', {
                ip: storedIp
              }).then(() => {
                ip.value = storedIp
                user.value = username
    
              }).catch(error => {
                console.error('Error during login:', error)
              })

        }
    }

    const getLoginList = async () => {
        await axios.get('/users').then((response) => {
            const responseData = response.data
            console.log("Response data:", responseData.users)
            loginList.value = responseData.users
        }).catch((error) => {
            console.error("Error fetching login list:", error)
        })
    }
    
    const autoLogin = (selectedLogin) => {
        axios.post('/autoLogin', {
            ip: selectedLogin.ip 
          }).then(() => {
            user.value = selectedLogin.username
            ip.value = selectedLogin.ip

            sessionStorage.setItem("lastLogin", JSON.stringify({ ip: ip.value, username: user.value }))

            router.push({ name: 'home' })
          }).catch(error => {
            console.error('Error during login:', error)
          })
    }


    const logout = () => {
        axios.get('/logout').then(() => {
            console.log("Logout successful")
        }).catch(error => {
            console.error('Error during logout:', error)
        })
        user.value = null
        ip.value = null
        sessionStorage.removeItem("lastLogin")
        router.push({ name: 'login' })
    }


    return { ip, user, login, restoreLogin, getLoginList, autoLogin, logout, loginList} 
})