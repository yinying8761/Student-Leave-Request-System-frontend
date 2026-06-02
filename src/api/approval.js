import request from '../utils/request'

export function getPendingApprovals() {
  return request.get('/approvals/pending')
}

export function approve(data) {
  return request.post('/approvals', data)
}

export function getApprovalHistory() {
  return request.get('/approvals/history')
}
