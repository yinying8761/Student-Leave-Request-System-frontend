<script setup>
import { watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from './stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const isLoginPage = computed(() => route.path === '/login')

const showNav = computed(() => {
  const hiddenNav = ['/login']
  return !hiddenNav.includes(route.path)
})

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-container">
    <el-container v-if="showNav">
      <el-header class="app-header">
        <div class="header-left">
          <h2>学生请销假系统</h2>
        </div>
        <div class="header-right" v-if="userStore.token">
          <span class="user-info">{{ userStore.realName }} ({{ userStore.roleLabel }})</span>
          <el-button type="danger" text @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="app-sidebar">
          <el-menu
            :default-active="route.path"
            router
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
          >
            <el-menu-item index="/dashboard">
              <el-icon><DataBoard /></el-icon>
              <span>工作台</span>
            </el-menu-item>
            <el-menu-item index="/applications" v-if="userStore.role === 'STUDENT'">
              <el-icon><Document /></el-icon>
              <span>我的请假</span>
            </el-menu-item>
            <el-menu-item index="/applications/create" v-if="userStore.role === 'STUDENT'">
              <el-icon><Edit /></el-icon>
              <span>发起请假</span>
            </el-menu-item>
            <el-menu-item index="/approvals" v-if="userStore.role === 'COUNSELOR'">
              <el-icon><Checked /></el-icon>
              <span>待审批</span>
            </el-menu-item>
            <el-menu-item index="/cancellations" v-if="userStore.role === 'COUNSELOR'">
              <el-icon><CircleCheck /></el-icon>
              <span>销假管理</span>
            </el-menu-item>
            <el-menu-item index="/statistics" v-if="['COUNSELOR','ADMIN'].includes(userStore.role)">
              <el-icon><TrendCharts /></el-icon>
              <span>数据统计</span>
            </el-menu-item>
            <el-menu-item index="/users" v-if="userStore.role === 'ADMIN'">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/profile">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="app-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
    <router-view v-else />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body, #app, .app-container {
  height: 100%;
}
.app-header {
  background: #2b579a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 56px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-info {
  font-size: 14px;
}
.app-sidebar {
  background: #304156;
}
.app-main {
  background: #f0f2f5;
  min-height: calc(100vh - 56px);
}
</style>
