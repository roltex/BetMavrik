const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function runAcceptanceTest() {
  console.log('🧪 BetMavrik API Acceptance Test\n');
  console.log('Testing Block 1: Core Functionality\n');

  try {
    // Block 1: Get Games List
    console.log('1️⃣  Testing: Get Games List');
    const gamesResponse = await axios.get(`${BASE_URL}/games`);
    console.log(`✅ Games list: Found ${gamesResponse.data.length} games`);
    
    // Look for acceptance:test game
    const acceptanceTestGame = gamesResponse.data.find(game => 
      game.title === 'acceptance:test' || game.id === 'acceptance:test'
    );
    
    if (acceptanceTestGame) {
      console.log(`🎯 Found acceptance:test game: ${acceptanceTestGame.title} (ID: ${acceptanceTestGame.id})`);
    } else {
      console.log('⚠️  acceptance:test game not found');
      console.log('📋 Sample games:', gamesResponse.data.slice(0, 3).map(g => ({ id: g.id, title: g.title })));
    }

    // Block 2: Get User Information
    console.log('\n2️⃣  Testing: Get User Information');
    const userResponse = await axios.get(`${BASE_URL}/users/me`);
    const userData = userResponse.data;
    console.log(`✅ User info: ${userData.username} (ID: ${userData.id})`);
    console.log(`💰 Balance: ${userData.balance}`);

    // Block 3: Launch Game Session
    console.log('\n3️⃣  Testing: Launch Game Session');
    
    // Try with acceptance:test game first
    if (acceptanceTestGame) {
      console.log('🎯 Creating session for acceptance:test game...');
      const sessionResponse = await axios.post(`${BASE_URL}/games`, {
        game_id: acceptanceTestGame.id
      });
      console.log(`✅ Session created: ${sessionResponse.data.url}`);
    } else {
      // Fallback to test game
      console.log('🎮 Creating session for test game (ID: 58322)...');
      const sessionResponse = await axios.post(`${BASE_URL}/games`, {
        game_id: 58322
      });
      console.log(`✅ Session created: ${sessionResponse.data.url}`);
    }

    // Additional validations
    console.log('\n4️⃣  Additional Validations:');
    
    // Test wallet operations
    console.log('💰 Testing wallet operations...');
    const betResponse = await axios.post(`${BASE_URL}/wallet/play`, {
      user_id: userData.id,
      amount: -10,
      game_id: '58322'
    });
    console.log(`✅ Bet processed: Balance ${betResponse.data.balance}`);

    const winResponse = await axios.post(`${BASE_URL}/wallet/play`, {
      user_id: userData.id,
      amount: 20,
      game_id: '58322'
    });
    console.log(`✅ Win processed: Balance ${winResponse.data.balance}`);

    // Test transactions
    console.log('📊 Testing transaction history...');
    const transactionsResponse = await axios.get(`${BASE_URL}/wallet/transactions/${userData.id}`);
    console.log(`✅ Transactions: Found ${transactionsResponse.data.length} transactions`);

    // Health check
    console.log('🏥 Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health: ${healthResponse.data.status}`);

    console.log('\n🎉 ACCEPTANCE TEST PASSED!');
    console.log('\n📋 Summary:');
    console.log('✅ Get Games List - PASSED');
    console.log('✅ Get User Information - PASSED');
    console.log('✅ Launch Game Session - PASSED');
    console.log('✅ Additional Validations - PASSED');
    console.log('✅ Health Check - PASSED');

  } catch (error) {
    console.error('❌ ACCEPTANCE TEST FAILED!');
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    process.exit(1);
  }
}

// Run the acceptance test
runAcceptanceTest(); 