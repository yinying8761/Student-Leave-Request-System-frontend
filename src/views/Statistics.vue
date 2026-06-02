<script setup>
import { ref, onMounted } from 'vue'
import request from '../utils/request'

const data = ref([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await request.get('/statistics/class')
    data.value = res.data || []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h3>数据统计</h3>
    <el-table :data="data" v-loading="loading" style="margin-top:16px;max-width:800px;">
      <el-table-column prop="studentName" label="学生" />
      <el-table-column prop="className" label="班级" />
      <el-table-column prop="totalCount" label="请假次数" />
      <el-table-column prop="totalDays" label="累计天数" />
    </el-table>
    <p v-if="!loading && !data.length" style="text-align:center;color:#909399;margin-top:40px;">暂无统计数据</p>
  </div>
</template>
