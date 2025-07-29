const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🧪 Testing BetMavrik Backend Endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health endpoint:', healthResponse.data);

    // Test 2: Root endpoint
    console.log('\n2. Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/`);
    console.log('✅ Root endpoint:', rootResponse.data);

    // Test 3: Get user info
    console.log('\n3. Testing user endpoint...');
    const userResponse = await axios.get(`${BASE_URL}/users/me`);
    console.log('✅ User endpoint:', userResponse.data);

    // Test 4: Get games
    console.log('\n4. Testing games endpoint...');
    const gamesResponse = await axios.get(`${BASE_URL}/games`);
    console.log('✅ Games endpoint:', gamesResponse.data);
    
    // Validate game structure with new fields
    if (gamesResponse.data && gamesResponse.data.length > 0) {
      const firstGame = gamesResponse.data[0];
      console.log('📋 Validating game structure...');
      
      // Check mandatory fields
      console.log('\n📋 Mandatory Fields Validation:');
      const mandatoryFields = ['id', 'title', 'category', 'feature_group', 'devices', 'licenses', 'jackpot_type'];
      mandatoryFields.forEach(field => {
        const hasField = field in firstGame;
        const value = firstGame[field];
        let status, displayValue;
        
        if (!hasField) {
          status = '❌';
          displayValue = 'MISSING';
        } else if (value === null || value === undefined || value === '') {
          status = '⚠️';
          displayValue = 'EMPTY';
        } else {
          status = '✅';
          displayValue = value;
        }
        
        console.log(`   ${status} ${field}: ${displayValue}`);
      });
      
      // Check optional mandatory fields
      console.log('\n📋 Optional Mandatory Fields:');
      const optionalMandatoryFields = ['forbid_bonus_play', 'accumulating', 'bonus_buy', 'customised'];
      optionalMandatoryFields.forEach(field => {
        const hasField = field in firstGame;
        const value = firstGame[field];
        let status, displayValue;
        
        if (!hasField) {
          status = '❌';
          displayValue = 'MISSING';
        } else if (value === null || value === undefined || value === '') {
          status = '⚠️';
          displayValue = 'EMPTY';
        } else {
          status = '✅';
          displayValue = value;
        }
        
        console.log(`   ${status} ${field}: ${displayValue}`);
      });
      
      // Check optional fields
      console.log('\n📊 Optional Fields Validation:');
      const optionalFields = ['producer', 'theme', 'has_freespins', 'payout', 'hit_rate', 'volatility_rating', 'has_jackpot', 'lines', 'ways', 'description', 'has_live', 'hd', 'multiplier', 'released_at', 'recalled_at', 'restrictions'];
      optionalFields.forEach(field => {
        const hasField = field in firstGame;
        const value = firstGame[field];
        let status, displayValue;
        
        if (!hasField) {
          status = '❌';
          displayValue = 'MISSING';
        } else if (value === null || value === undefined || value === '') {
          status = '⚠️';
          displayValue = 'EMPTY';
        } else {
          status = '✅';
          displayValue = value;
        }
        
        console.log(`   ${status} ${field}: ${displayValue}`);
      });
      
      // Check thumbnail URLs
      console.log('\n🖼️ Thumbnail URLs Validation:');
      const thumbnailFields = ['thumbnail', 'thumbnail_horizontal', 'thumbnail_vertical'];
      thumbnailFields.forEach(field => {
        const hasField = field in firstGame;
        const value = firstGame[field];
        let status, displayValue;
        
        if (!hasField) {
          status = '❌';
          displayValue = 'MISSING';
        } else if (value === null || value === undefined || value === '') {
          status = '⚠️';
          displayValue = 'EMPTY';
        } else {
          status = '✅';
          displayValue = value;
        }
        
        console.log(`   ${status} ${field}: ${displayValue}`);
      });
      
      console.log('🎮 Sample game data:');
      console.log(`   ID: ${firstGame.id}`);
      console.log(`   Title: ${firstGame.title}`);
      console.log(`   Category: ${firstGame.category}`);
      console.log(`   Producer: ${firstGame.producer || 'EMPTY'}`);
      console.log(`   Theme: ${firstGame.theme || 'EMPTY'}`);
      console.log(`   Devices: ${firstGame.devices?.join(', ') || 'EMPTY'}`);
      console.log(`   Licenses: ${firstGame.licenses?.join(', ') || 'EMPTY'}`);
      console.log(`   Jackpot Type: ${firstGame.jackpot_type}`);
      console.log(`   Forbid Bonus Play: ${firstGame.forbid_bonus_play !== undefined ? firstGame.forbid_bonus_play : 'EMPTY'}`);
      console.log(`   Accumulating: ${firstGame.accumulating !== undefined ? firstGame.accumulating : 'EMPTY'}`);
      console.log(`   Bonus Buy: ${firstGame.bonus_buy !== undefined ? firstGame.bonus_buy : 'EMPTY'}`);
      console.log(`   Customised: ${firstGame.customised !== undefined ? firstGame.customised : 'EMPTY'}`);
      console.log(`   Payout: ${firstGame.payout || 'EMPTY'}%`);
      console.log(`   Volatility: ${firstGame.volatility_rating || 'EMPTY'}`);
      console.log(`   Lines: ${firstGame.lines || 'EMPTY'}`);
      console.log(`   Ways: ${firstGame.ways || 'EMPTY'}`);
      console.log(`   Has Live: ${firstGame.has_live !== undefined ? firstGame.has_live : 'EMPTY'}`);
      console.log(`   HD: ${firstGame.hd !== undefined ? firstGame.hd : 'EMPTY'}`);
      console.log(`   Has Jackpot: ${firstGame.has_jackpot !== undefined ? firstGame.has_jackpot : 'EMPTY'}`);
              console.log(`   Has Freespins: ${firstGame.has_freespins !== undefined ? firstGame.has_freespins : 'EMPTY'}`);
      }
      
      // Field statistics summary
      console.log('\n📊 Field Statistics:');
      const allFields = [...mandatoryFields, ...optionalMandatoryFields, ...optionalFields, ...thumbnailFields];
      const presentFields = allFields.filter(field => field in firstGame);
      const emptyFields = presentFields.filter(field => {
        const value = firstGame[field];
        return value === null || value === undefined || value === '';
      });
      const populatedFields = presentFields.filter(field => {
        const value = firstGame[field];
        return value !== null && value !== undefined && value !== '';
      });
      
      console.log(`   Total fields: ${allFields.length}`);
      console.log(`   Present fields: ${presentFields.length}`);
      console.log(`   Populated fields: ${populatedFields.length}`);
      console.log(`   Empty fields: ${emptyFields.length}`);
      console.log(`   Missing fields: ${allFields.length - presentFields.length}`);
      console.log(`   Data quality: ${Math.round((populatedFields.length / allFields.length) * 100)}%`);

    // Test 5: Get transactions
    console.log('\n5. Testing transactions endpoint...');
    const userId = userResponse.data.id;
    const transactionsResponse = await axios.get(`${BASE_URL}/wallet/transactions/${userId}`);
    console.log('✅ Transactions endpoint:', transactionsResponse.data);

    // Test 6: Test wallet play (bet)
    console.log('\n6. Testing wallet play (bet)...');
    const betResponse = await axios.post(`${BASE_URL}/wallet/play`, {
      user_id: userId,
      amount: -10,
      game_id: '58322'
    });
    console.log('✅ Wallet play (bet):', betResponse.data);

    // Test 7: Test wallet play (win)
    console.log('\n7. Testing wallet play (win)...');
    const winResponse = await axios.post(`${BASE_URL}/wallet/play`, {
      user_id: userId,
      amount: 20,
      game_id: '58322'
    });
    console.log('✅ Wallet play (win):', winResponse.data);

    // Test 8: Test game session creation
    console.log('\n8. Testing game session creation...');
    const sessionResponse = await axios.post(`${BASE_URL}/games`, {
      game_id: 58322
    });
    console.log('✅ Game session creation:', sessionResponse.data);

    console.log('\n🎉 All endpoints tested successfully!');
    console.log('\n📊 Summary:');
    console.log('- Health check: ✅');
    console.log('- User info: ✅');
    console.log('- Games list: ✅');
    console.log('- Transactions: ✅');
    console.log('- Wallet operations: ✅');
    console.log('- Game sessions: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Make sure the server is running on port 3000');
    console.log('- Check if Redis is running');
    console.log('- Verify environment variables are set');
  }
}

testEndpoints(); 