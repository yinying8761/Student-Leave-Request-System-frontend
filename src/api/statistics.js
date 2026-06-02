import request from '../utils/request'

export function getDashboardStats() {
  return request.get('/statistics/dashboard')
}

export function getStudentStats(id) {
  return request.get('/statistics/student/' + id)
}

export function getClassStats() {
  return request.get('/statistics/class')
}
