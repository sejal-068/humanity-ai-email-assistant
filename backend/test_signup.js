const axios = require('axios');
(async () => {
  try {
    const response = await axios.post('http://localhost:5001/api/auth/signup', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
      role: 'assistant'
    });
    console.log('Signup succeeded:', response.data);
  } catch (err) {
    if (err.response) {
      console.error('Signup failed, status', err.response.status, 'data', err.response.data);
    } else {
      console.error('Error', err.message);
    }
  }
})();

