<script setup>
import { useUserStore } from '../stores/user'
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const userStore = useUserStore()
const stats = ref({ pendingCount: 0, totalCount: 0 })

onMounted(async () => {
  try {
    const res = await request.get('/statistics/dashboard')
    stats.value = res.data
  } catch (e) { /* ignore */ }
})
</script>

<template>
  <div>
    <h3>工作台</h3>
    <p style="color:#909399;margin-top:8px;">欢迎使用学生请销假系统</p>

    <el-row :gutter="20" style="margin-top:24px;">
      <el-col :span="8">
        <el-card shadow="hover">
          <div style="text-align:center;">
            <span style="font-size:36px;color:#409EFF;">{{ stats.pendingCount }}</span>
            <p style="color:#909399;">待审批</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div style="text-align:center;">
            <span style="font-size:36px;color:#67C23A;">{{ stats.totalCount }}</span>
            <p style="color:#909399;">总申请数</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div style="text-align:center;">
            <span style="font-size:36px;color:#E6A23C;">{{ userStore.roleLabel }}</span>
            <p style="color:#909399;">当前角色</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
