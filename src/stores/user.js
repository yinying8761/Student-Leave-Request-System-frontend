import { defineStore } from 'pinia'

const ROLE_LABEL = {
  STUDENT: '学生',
  COUNSELOR: '辅导员',
  ADMIN: '管理员'
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    id: null,
    username: '',
    realName: '',
    role: '',
    phone: '',
    email: '',
    department: '',
    className: '',
    counselorId: null,
    counselorName: ''
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    roleLabel: (state) => ROLE_LABEL[state.role] || state.role
  },

  actions: {
    setUser(info) {
      this.id = info.id
      this.username = info.username
      this.realName = info.realName
      this.role = info.role
      this.phone = info.phone || ''
      this.email = info.email || ''
      this.department = info.department || ''
      this.className = info.className || ''
      this.counselorId = info.counselorId || null
      this.counselorName = info.counselorName || ''
    },

    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    logout() {
      this.token = ''
      this.id = null
      this.username = ''
      this.realName = ''
      this.role = ''
      this.phone = ''
      this.email = ''
      this.department = ''
      this.className = ''
      this.counselorId = null
      this.counselorName = ''
      localStorage.removeItem('token')
    }
  }
})
