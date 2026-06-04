<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const page = ref({ current: 1, size: 10, total: 0 })

const typeLabel = { PERSONAL: '事假', SICK: '病假', OFFICIAL: '公假', OTHER: '其他' }
const statusLabel = { PENDING: '待审批', APPROVED: '已通过', REJECTED: '已驳回', CANCELLING: '销假中', CANCELLED: '已销假' }

async function fetchData() {
  loading.value = true
  try {
    const res = await request.get('/applications', { params: page.value })
    list.value = res.data.records
    page.value.total = res.data.total
  } finally {
    loading.value = false
  }
}

function goDetail(id) { router.push('/applications/' + id) }

onMounted(fetchData)
</script>

<template>
  <div>
    <h3>我的请假</h3>
    <el-table :data="list" v-loading="loading" style="margin-top:16px;" @row-click="(row) => goDetail(row.id)">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="leaveType" label="类型" width="100">
        <template #default="{row}">{{ typeLabel[row.leaveType] }}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="160" />
      <el-table-column prop="endTime" label="结束时间" width="160" />
      <el-table-column prop="durationDays" label="天数" width="80" />
      <el-table-column prop="status" label="状态" width="140">
        <template #default="{row}">
          <el-tag :type="row.status === 'APPROVED' ? 'success' : row.status === 'REJECTED' ? 'danger' : 'warning'" size="small">
            {{ statusLabel[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="160" />
    </el-table>
    <el-pagination v-model:current-page="page.current" :page-size="page.size" :total="page.total" layout="prev, pager, next" @current-change="fetchData" style="margin-top:16px;justify-content:flex-end;" />
  </div>
</template>
