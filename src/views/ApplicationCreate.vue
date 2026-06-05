<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { regionData, codeToText } from 'element-china-area-data'
import request from '../utils/request'

const router = useRouter()
const loading = ref(false)

const form = ref({
  leaveType: 'PERSONAL',
  startTime: '',
  endTime: '',
  reason: '',
  isLeaveCampus: false,
  destinationCodes: [],
  destinationProvince: '',
  destinationCity: '',
  destinationDistrict: '',
  destinationDetail: '',
  contactPhone: '',
  emergencyContactName: '',
  emergencyContactPhone: ''
})

const rules = {
  leaveType: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  reason: [{ required: true, message: '请填写请假原因', trigger: 'blur' }],
  isLeaveCampus: [{ required: true, message: '请选择是否离校', trigger: 'change' }],
  destinationCodes: [{ required: true, message: '请选择目的地省市区', trigger: 'change' }],
  destinationDetail: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入本人联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  emergencyContactName: [{ required: true, message: '请输入紧急联系人姓名', trigger: 'blur' }],
  emergencyContactPhone: [
    { required: true, message: '请输入紧急联系人电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

watch(() => form.value.isLeaveCampus, (val) => {
  if (!val) {
    form.value.destinationCodes = []
    form.value.destinationProvince = ''
    form.value.destinationCity = ''
    form.value.destinationDistrict = ''
    form.value.destinationDetail = ''
  }
})

const formRef = ref(null)
const cascaderRef = ref(null)

async function submit() {
  if (form.value.isLeaveCampus) {
    if (form.value.destinationCodes.length !== 3) {
      ElMessage.warning('请选择完整的省市区')
      return
    }
    form.value.destinationProvince = codeToText[form.value.destinationCodes[0]]
    form.value.destinationCity = codeToText[form.value.destinationCodes[1]]
    form.value.destinationDistrict = codeToText[form.value.destinationCodes[2]]
  }
  await formRef.value.validate()
  loading.value = true
  try {
    await request.post('/applications', form.value)
    ElMessage.success('请假申请已提交')
    router.push('/applications')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h3>发起请假</h3>
    <el-card style="max-width:600px;margin-top:16px;">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="请假类型" prop="leaveType">
          <el-select v-model="form.leaveType">
            <el-option label="事假" value="PERSONAL" />
            <el-option label="病假" value="SICK" />
            <el-option label="公假" value="OFFICIAL" />
            <el-option label="其他" value="OTHER" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="是否离校" prop="isLeaveCampus">
          <el-radio-group v-model="form.isLeaveCampus">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.isLeaveCampus">
          <el-form-item label="目的地" prop="destinationCodes">
            <el-cascader
              ref="cascaderRef"
              v-model="form.destinationCodes"
              :options="regionData"
              :props="{ label: 'label', value: 'value' }"
              placeholder="请选择省/市/区"
              clearable
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="详细地址" prop="destinationDetail">
            <el-input v-model="form.destinationDetail" placeholder="请填写详细地址（如XX路XX号）" />
          </el-form-item>
        </template>
        <el-form-item label="本人联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入本人联系电话" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContactName">
          <el-input v-model="form.emergencyContactName" placeholder="请输入紧急联系人姓名" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyContactPhone">
          <el-input v-model="form.emergencyContactPhone" placeholder="请输入紧急联系人电话" />
        </el-form-item>
        <el-form-item label="请假原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" :rows="4" placeholder="请详细说明请假原因" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submit">提交申请</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
