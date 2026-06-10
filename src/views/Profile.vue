<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import request from '../utils/request'

const userStore = useUserStore()

const counselors = ref([])

async function loadCounselors() {
  try {
    const res = await request.get('/users/counselors')
    counselors.value = res.data
  } catch { /* ignore */ }
}
loadCounselors()

const isEditing = ref(false)
const form = reactive({
  realName: userStore.realName,
  phone: userStore.phone,
  email: userStore.email,
  department: userStore.department,
  className: userStore.className,
  counselorId: userStore.counselorId
})

const pwdDialogVisible = ref(false)
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwdFormRef = ref(null)

function startEdit() {
  form.realName = userStore.realName
  form.phone = userStore.phone
  form.email = userStore.email
  form.department = userStore.department
  form.className = userStore.className
  form.counselorId = userStore.counselorId
  isEditing.value = true
}

function cancelEdit() {
  isEditing.value = false
}

async function saveProfile() {
  const res = await request.put('/users/profile', form)
  userStore.setUser({ ...userStore, ...res.data })
  ElMessage.success('保存成功')
  isEditing.value = false
}

function openPwdDialog() {
  pwdForm.oldPassword = ''
  pwdForm.newPassword = ''
  pwdForm.confirmPassword = ''
  pwdDialogVisible.value = true
}

async function changePassword() {
  await pwdFormRef.value.validate()
  if (pwdForm.newPassword !== pwdForm.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }
  await request.put('/users/password', {
    oldPassword: pwdForm.oldPassword,
    newPassword: pwdForm.newPassword
  })
  ElMessage.success('密码修改成功，请重新登录')
  pwdDialogVisible.value = false
  userStore.logout()
  window.location.href = '/login'
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }]
}
</script>

<template>
  <div>
    <h3>个人信息</h3>
    <el-card style="max-width:500px;margin-top:16px;">
      <el-descriptions :column="1" border v-if="!isEditing">
        <el-descriptions-item label="用户名">{{ userStore.username }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ userStore.realName }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ userStore.roleLabel }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ userStore.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ userStore.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="院系">{{ userStore.department || '-' }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ userStore.className || '-' }}</el-descriptions-item>
        <el-descriptions-item v-if="userStore.role === 'STUDENT'" label="辅导员">{{ userStore.counselorName || '未分配' }}</el-descriptions-item>
      </el-descriptions>

      <el-form v-else :model="form" label-width="80px">
        <el-form-item label="用户名"><el-input :value="userStore.username" disabled /></el-form-item>
        <el-form-item label="姓名"><el-input v-model="form.realName" /></el-form-item>
        <el-form-item label="角色"><el-input :value="userStore.roleLabel" disabled /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="院系"><el-input v-model="form.department" /></el-form-item>
        <el-form-item label="班级"><el-input v-model="form.className" /></el-form-item>
        <el-form-item v-if="userStore.role === 'STUDENT'" label="辅导员">
          <el-select v-model="form.counselorId" filterable clearable placeholder="请选择辅导员">
            <el-option v-for="u in counselors" :key="u.id" :label="u.realName" :value="u.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <div style="margin-top:16px;">
        <template v-if="!isEditing">
          <el-button type="primary" @click="startEdit">编辑资料</el-button>
          <el-button @click="openPwdDialog">修改密码</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="saveProfile">保存</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </template>
      </div>
    </el-card>

    <el-dialog v-model="pwdDialogVisible" title="修改密码" width="400px">
      <el-form :model="pwdForm" :rules="pwdRules" ref="pwdFormRef" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
