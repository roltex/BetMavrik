const axios = require('axios');
const crypto = require('crypto');

const KEY = '6JVJ8CNW7NMW2FBHMB84344G1FE4VL';
const PRIVATE = '8W5pfb0ptu6yDZlSJenQPsE01c1PaN76KTibj7a0Mx';
const GCP_URL = 'https://papiconnector.all-ingame.com/api/casino/';
const BASE_URL = 'http://localhost:3000';
const RETURN_URL = 'http://localhost:3000/casino';

function generateSignature(body) {
  return crypto
    .createHmac('sha256', PRIVATE)
    .update(body)
    .digest('hex');
}

function getHeaders(body = '') {
  return {
    'X-REQUEST-SIGN': generateSignature(body),
    'allingame-key': KEY,
    'Content-Type': 'application/json',
  };
}

async function testSession() {
  console.log('🧪 Testing GCP Session Creation...\n');

  try {
    // Get current user data from our API
    const userResponse = await axios.get(`${BASE_URL}/users/me`);
    const userData = userResponse.data;
    
    console.log(`👤 Using user: ${userData.username} (${userData.id})`);
    
    const sessionData = {
      game_id: 58322,
      locale: 'en',
      client_type: 'desktop',
      ip: '127.0.0.1',
      currency: 'TRY',
      rtp: 90,
      url: {
        return_url: 'https://betmavrik-frontend.up.railway.app/casino',
        deposit_url: 'https://betmavrik-frontend.up.railway.app/casino'
      },
      user: {
        user_id: userData.id,
        nickname: userData.username,
        firstname: 'Demo',
        lastname: 'User',
        country: 'US',
        city: 'New York',
        date_of_birth: '1990-01-01',
        registred_at: '2024-01-01T00:00:00.000Z',
        gender: 'm'
      }
    };

    const body = JSON.stringify(sessionData);
    const headers = getHeaders(body);
    
    console.log('🎮 Creating session for game 58322...');
    
    const response = await axios.post(
      `${GCP_URL}session`,
      body,
      { headers }
    );
    
    console.log('✅ Session created successfully!');
    console.log('📋 Response:', response.data);
    
    // Validate session response structure
    if (response.data) {
      console.log('🔍 Session validation:');
      console.log(`   Game ID: ${sessionData.game_id}`);
      console.log(`   User ID: ${sessionData.user.user_id}`);
      console.log(`   Currency: ${sessionData.currency}`);
      console.log(`   RTP: ${sessionData.rtp}%`);
      console.log(`   Client Type: ${sessionData.client_type}`);
      console.log(`   Return URL: ${sessionData.url.return_url}`);
      
      if (response.data.url) {
        console.log(`   Game URL: ${response.data.url}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Session creation failed:', error.response?.data?.message || error.message);
  }
}

testSession(); 