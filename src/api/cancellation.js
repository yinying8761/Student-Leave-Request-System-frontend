import request from '../utils/request'

export function getPendingCancellations() {
  return request.get('/cancellations/pending')
}

export function createCancellation(data) {
  return request.post('/cancellations', data)
}

export function approveCancellation(id) {
  return request.put('/cancellations/' + id + '/approve')
}
