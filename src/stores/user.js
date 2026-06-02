import { defineStore } from 'pinia'

const ROLE_LABEL = {
  STUDENT: '学生',
  ADVISOR: '导师',
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
    department: ''
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
      this.department = info.department
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
      this.department = ''
      localStorage.removeItem('token')
    }
  }
})
