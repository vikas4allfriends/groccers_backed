import axios from 'axios';
const token = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NjAzOThhNjI2NGVlNDg5YzcwZWFlZCIsInJvbGUiOiJDdXN0b21lciIsInBlcm1pc3Npb25zIjpbIkNhbmNlbE9yZGVyIl0sImlhdCI6MTczNzg3MzI5OCwiZXhwIjoxNzM4MzA1Mjk4fQ.rVgdJdaG5UqkJBuoM-Ln-TNIaaV_xTvGbJTeBiz1i2k"
axios.defaults.baseURL = 'http://localhost:3000/api/'
axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
export default axios;