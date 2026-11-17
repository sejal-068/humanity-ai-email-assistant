const axios = require('axios');
(async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'assistant@humanity.ai',
      password: 'Password123'
    });
    console.log('Login succeeded:', response.data.user);
  } catch (err) {
    if (err.response) {
      console.error('Login failed, status', err.response.status, 'data', err.response.data);
    } else {
      console.error('Error', err.message);
    }
  }
})();
