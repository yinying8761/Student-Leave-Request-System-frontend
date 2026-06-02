<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const list = ref([])
const loading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const res = await request.get('/cancellations/pending')
    list.value = res.data
  } finally {
    loading.value = false
  }
}

async function approveCancellation(item) {
  await request.put('/cancellations/' + item.id + '/approve')
  ElMessage.success('销假已确认')
  fetchData()
}

onMounted(fetchData)
</script>

<template>
  <div>
    <h3>销假管理</h3>
    <el-table :data="list" v-loading="loading" style="margin-top:16px;">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="studentName" label="学生" width="100" />
      <el-table-column prop="applicationId" label="申请编号" width="100" />
      <el-table-column prop="returnTime" label="返校时间" width="160" />
      <el-table-column prop="comment" label="说明" min-width="200" />
      <el-table-column label="操作" width="120">
        <template #default="{row}">
          <el-button type="success" size="small" @click="approveCancellation(row)">确认销假</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="!loading && !list.length" style="text-align:center;color:#909399;margin-top:40px;">暂无待销假记录</p>
  </div>
</template>
