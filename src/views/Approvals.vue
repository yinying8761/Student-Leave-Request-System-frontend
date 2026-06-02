<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'

const list = ref([])
const loading = ref(false)

const typeLabel = { PERSONAL: '事假', SICK: '病假', OFFICIAL: '公假', OTHER: '其他' }

async function fetchData() {
  loading.value = true
  try {
    const res = await request.get('/approvals/pending')
    list.value = res.data
  } finally {
    loading.value = false
  }
}

async function approve(item, action) {
  try {
    const { value: comment } = await ElMessageBox.prompt(
      action === 'APPROVE' ? '请输入审批意见（可选）' : '请输入驳回理由',
      action === 'APPROVE' ? '确认通过' : '确认驳回',
      { inputType: 'textarea' }
    ) || { value: '' }
    await request.post('/approvals', { applicationId: item.id, action, comment })
    ElMessage.success(action === 'APPROVE' ? '已通过' : '已驳回')
    fetchData()
  } catch (e) {
    if (e !== 'cancel') { /* ignore cancel */ }
  }
}

onMounted(fetchData)
</script>

<template>
  <div>
    <h3>待审批</h3>
    <el-table :data="list" v-loading="loading" style="margin-top:16px;">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="studentName" label="学生" width="100" />
      <el-table-column label="类型" width="80">
        <template #default="{row}">{{ typeLabel[row.leaveType] }}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="160" />
      <el-table-column prop="endTime" label="结束时间" width="160" />
      <el-table-column prop="durationDays" label="天数" width="70" />
      <el-table-column prop="reason" label="原因" min-width="200" />
      <el-table-column label="操作" width="200">
        <template #default="{row}">
          <el-button type="success" size="small" @click="approve(row, 'APPROVE')">通过</el-button>
          <el-button type="danger" size="small" @click="approve(row, 'REJECT')">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="!loading && !list.length" style="text-align:center;color:#909399;margin-top:40px;">暂无待审批申请</p>
  </div>
</template>
