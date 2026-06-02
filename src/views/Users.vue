<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../utils/request'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const form = ref({
  id: null, username: '', password: '', realName: '', role: 'STUDENT',
  phone: '', email: '', department: '', className: '', advisorId: null, counselorId: null
})

const roleLabel = { STUDENT: '学生', ADVISOR: '导师', COUNSELOR: '辅导员', ADMIN: '管理员' }

async function fetchData() {
  loading.value = true
  try {
    const res = await request.get('/users')
    list.value = res.data
  } finally {
    loading.value = false
  }
}

function openCreate() {
  isEdit.value = false
  form.value = { id: null, username: '', password: '', realName: '', role: 'STUDENT', phone: '', email: '', department: '', className: '', advisorId: null, counselorId: null }
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  form.value = { ...row, password: '' }
  dialogVisible.value = true
}

async function save() {
  await formRef.value.validate()
  if (isEdit.value) {
    await request.put('/users/' + form.value.id, form.value)
    ElMessage.success('更新成功')
  } else {
    await request.post('/users', form.value)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  fetchData()
}

async function remove(row) {
  await ElMessageBox.confirm('确认删除该用户？', '警告', { type: 'warning' })
  await request.delete('/users/' + row.id)
  ElMessage.success('已删除')
  fetchData()
}

onMounted(fetchData)
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <h3>用户管理</h3>
      <el-button type="primary" @click="openCreate">新增用户</el-button>
    </div>
    <el-table :data="list" v-loading="loading" style="margin-top:16px;">
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="realName" label="姓名" width="100" />
      <el-table-column label="角色" width="100">
        <template #default="{row}">{{ roleLabel[row.role] }}</template>
      </el-table-column>
      <el-table-column prop="department" label="院系" width="120" />
      <el-table-column prop="className" label="班级" width="100" />
      <el-table-column prop="phone" label="手机号" width="120" />
      <el-table-column label="操作" width="160">
        <template #default="{row}">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑用户' : '新增用户'" width="500px">
      <el-form :model="form" ref="formRef" label-width="80px">
        <el-form-item label="用户名" required><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="密码" :required="!isEdit"><el-input v-model="form.password" type="password" :placeholder="isEdit ? '留空则不修改' : ''" /></el-form-item>
        <el-form-item label="姓名" required><el-input v-model="form.realName" /></el-form-item>
        <el-form-item label="角色" required>
          <el-select v-model="form.role">
            <el-option label="学生" value="STUDENT" />
            <el-option label="导师" value="ADVISOR" />
            <el-option label="辅导员" value="COUNSELOR" />
            <el-option label="管理员" value="ADMIN" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="院系"><el-input v-model="form.department" /></el-form-item>
        <el-form-item label="班级"><el-input v-model="form.className" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
