import axios from 'axios'

// 모든 API 호출은 이 인스턴스를 사용한다.
// 개발 중에는 Vite proxy가 /api 요청을 http://localhost:8080 으로 넘긴다.
const client = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client
