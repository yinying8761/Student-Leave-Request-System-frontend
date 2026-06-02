<script setup>
import { useUserStore } from '../stores/user'
const userStore = useUserStore()
</script>

<template>
  <div>
    <h3>个人信息</h3>
    <el-card style="max-width:500px;margin-top:16px;">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">{{ userStore.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ userStore.realName }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ userStore.roleLabel }}</el-descriptions-item>
        <el-descriptions-item label="院系">{{ userStore.department || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
