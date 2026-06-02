import request from '../utils/request'

export function getApplications(params) {
  return request.get('/applications', { params })
}

export function getApplicationDetail(id) {
  return request.get('/applications/' + id)
}

export function createApplication(data) {
  return request.post('/applications', data)
}

export function cancelApplication(id) {
  return request.put('/applications/' + id + '/cancel')
}
