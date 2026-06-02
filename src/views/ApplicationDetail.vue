<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import request from '../utils/request'

const route = useRoute()
const app = ref({})
const records = ref([])
const statusLabel = { PENDING_ADVISOR: '待导师审', PENDING_COUNSELOR: '待辅导员审', APPROVED: '已通过', REJECTED: '已驳回', CANCELLING: '销假中', CANCELLED: '已销假' }
const typeLabel = { PERSONAL: '事假', SICK: '病假', OFFICIAL: '公假', OTHER: '其他' }

onMounted(async () => {
  const res = await request.get('/applications/' + route.params.id)
  app.value = res.data.application
  records.value = res.data.records || []
})
</script>

<template>
  <div>
    <h3>请假详情 #{{ app.id }}</h3>
    <el-card v-if="app.id" style="margin-top:16px;">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="类型">{{ typeLabel[app.leaveType] }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag>{{ statusLabel[app.status] }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ app.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ app.endTime }}</el-descriptions-item>
        <el-descriptions-item label="天数">{{ app.durationDays }}天</el-descriptions-item>
        <el-descriptions-item label="学生">{{ app.studentName }}</el-descriptions-item>
        <el-descriptions-item label="请假原因" :span="2">{{ app.reason }}</el-descriptions-item>
      </el-descriptions>

      <h4 style="margin-top:24px;">审批记录</h4>
      <el-timeline v-if="records.length" style="margin-top:12px;">
        <el-timeline-item v-for="r in records" :key="r.id" :timestamp="r.createTime" :type="r.action === 'APPROVE' ? 'success' : 'danger'">
          {{ r.approverName }} — {{ r.action === 'APPROVE' ? '通过' : '驳回' }}
          <span v-if="r.comment">：{{ r.comment }}</span>
        </el-timeline-item>
      </el-timeline>
      <p v-else style="color:#909399;">暂无审批记录</p>
    </el-card>
  </div>
</template>
