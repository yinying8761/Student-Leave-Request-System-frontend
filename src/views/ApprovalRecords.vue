<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import request from '../utils/request'

const router = useRouter()
const userStore = useUserStore()
const list = ref([])
const loading = ref(false)
const page = ref({ current: 1, size: 10, total: 0 })

const typeLabel = { PERSONAL: '事假', SICK: '病假', OFFICIAL: '公假', OTHER: '其他' }
function statusLabel(row) {
  if (row.status === 'APPROVED') return row.isLeaveCampus ? '请假中（离校）' : '请假中（在校）'
  return { PENDING: '待审批', REJECTED: '已驳回', CANCELLING: '待销假', CANCELLED: '已销假' }[row.status] || row.status
}
function statusType(status) {
  if (status === 'APPROVED') return 'success'
  if (status === 'REJECTED') return 'danger'
  if (status === 'CANCELLING') return 'warning'
  if (status === 'CANCELLED') return 'info'
  return 'warning'
}

const cxlDialogVisible = ref(false)
const cxlForm = ref({ applicationId: null, returnTime: '', comment: '' })
const cxlLoading = ref(false)

function openCounselorCancel(row) {
  cxlForm.value = { applicationId: row.id, returnTime: '', comment: '' }
  cxlDialogVisible.value = true
}

async function submitCounselorCancel() {
  if (!cxlForm.value.returnTime) {
    ElMessage.warning('请选择返校时间')
    return
  }
  cxlLoading.value = true
  try {
    await request.post('/cancellations/counselor', cxlForm.value)
    ElMessage.success('销假已确认')
    cxlDialogVisible.value = false
    fetchData()
  } finally {
    cxlLoading.value = false
  }
}

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
    <h3>审批记录</h3>
    <el-table :data="list" v-loading="loading" style="margin-top:16px;" @row-click="(row) => goDetail(row.id)">
      <el-table-column prop="id" label="编号" width="80" />
      <el-table-column prop="studentName" label="学生" width="100" />
      <el-table-column label="类型" width="80">
        <template #default="{row}">{{ typeLabel[row.leaveType] }}</template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="160" />
      <el-table-column prop="endTime" label="结束时间" width="160" />
      <el-table-column prop="durationDays" label="天数" width="70" />
      <el-table-column label="状态" width="160">
        <template #default="{row}">
          <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="160" />
      <el-table-column v-if="userStore.role === 'COUNSELOR'" label="操作" width="120">
        <template #default="{row}">
          <el-button v-if="row.status === 'CANCELLING'" type="warning" size="small"
            @click.stop="openCounselorCancel(row)">代替销假</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="page.current" :page-size="page.size" :total="page.total" layout="prev, pager, next" @current-change="fetchData" style="margin-top:16px;justify-content:flex-end;" />

    <el-dialog v-model="cxlDialogVisible" title="代替销假" width="400px">
      <el-form :model="cxlForm" label-width="80px">
        <el-form-item label="返校时间" required>
          <el-date-picker v-model="cxlForm.returnTime" type="datetime" placeholder="选择返校时间" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="cxlForm.comment" type="textarea" :rows="2" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cxlDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="cxlLoading" @click="submitCounselorCancel">确认销假</el-button>
      </template>
    </el-dialog>
  </div>
</template>
