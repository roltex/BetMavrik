const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testGameFields() {
  console.log('🧪 Testing Game Fields Structure...\n');

  try {
    // Get games from our API
    console.log('📡 Fetching games from API...');
    const gamesResponse = await axios.get(`${BASE_URL}/games`);
    
    if (!gamesResponse.data || gamesResponse.data.length === 0) {
      console.log('❌ No games found');
      return;
    }

    const games = gamesResponse.data;
    console.log(`✅ Found ${games.length} games\n`);

    // Test first game structure
    const firstGame = games[0];
    console.log('🎮 Testing first game structure:');
    console.log(`   Game ID: ${firstGame.id}`);
    console.log(`   Title: ${firstGame.title}`);

    // Validate mandatory fields (based on documentation)
    console.log('\n📋 Mandatory Fields Validation:');
    const mandatoryFields = [
      'id', 'title', 'category', 'feature_group', 'devices', 
      'licenses', 'jackpot_type'
    ];

    let mandatoryPassed = true;
    mandatoryFields.forEach(field => {
      const hasField = field in firstGame;
      const value = firstGame[field];
      let status, displayValue;
      
      if (!hasField) {
        status = '❌';
        displayValue = 'MISSING';
        mandatoryPassed = false;
      } else if (value === null || value === undefined || value === '') {
        status = '⚠️';
        displayValue = 'EMPTY';
      } else {
        status = '✅';
        displayValue = value;
      }
      
      console.log(`   ${status} ${field}: ${displayValue}`);
    });

    // Validate optional mandatory fields (may not be present in all games)
    console.log('\n📋 Optional Mandatory Fields:');
    const optionalMandatoryFields = [
      'forbid_bonus_play', 'accumulating', 'bonus_buy', 'customised'
    ];

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

    // Validate optional fields
    console.log('\n📊 Optional Fields Validation:');
    const optionalFields = [
      'producer', 'theme', 'has_freespins', 'payout', 'hit_rate',
      'volatility_rating', 'has_jackpot', 'lines', 'ways', 'description',
      'has_live', 'hd', 'multiplier', 'released_at', 'recalled_at', 'restrictions'
    ];

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

    // Validate thumbnail URLs
    console.log('\n🖼️  Thumbnail URLs Validation:');
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

    // Test different game categories
    console.log('\n🎯 Game Categories Analysis:');
    const categories = [...new Set(games.map(game => game.category))];
    console.log(`   Found ${categories.length} categories: ${categories.join(', ')}`);

    // Test different producers
    const producers = [...new Set(games.filter(game => game.producer).map(game => game.producer))];
    console.log(`   Found ${producers.length} producers: ${producers.join(', ')}`);

    // Test different themes
    const themes = [...new Set(games.filter(game => game.theme).map(game => game.theme))];
    console.log(`   Found ${themes.length} themes: ${themes.slice(0, 10).join(', ')}${themes.length > 10 ? '...' : ''}`);

    // Test devices
    const allDevices = [...new Set(games.flatMap(game => game.devices || []))];
    console.log(`   Supported devices: ${allDevices.join(', ')}`);

    // Test licenses
    const allLicenses = [...new Set(games.flatMap(game => game.licenses || []))];
    console.log(`   Available licenses: ${allLicenses.join(', ')}`);

    // Test jackpot types
    const jackpotTypes = [...new Set(games.map(game => game.jackpot_type))];
    console.log(`   Jackpot types: ${jackpotTypes.join(', ')}`);

    // Test volatility ratings
    const volatilityRatings = [...new Set(games.filter(game => game.volatility_rating).map(game => game.volatility_rating))];
    console.log(`   Volatility ratings: ${volatilityRatings.join(', ')}`);

    // Summary
    console.log('\n📈 Summary:');
    console.log(`   Total games: ${games.length}`);
    console.log(`   Mandatory fields: ${mandatoryPassed ? '✅ ALL PRESENT' : '❌ MISSING FIELDS'}`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Producers: ${producers.length}`);
    console.log(`   Themes: ${themes.length}`);
    console.log(`   Live games: ${games.filter(game => game.has_live).length}`);
    console.log(`   HD games: ${games.filter(game => game.hd).length}`);
    console.log(`   Jackpot games: ${games.filter(game => game.has_jackpot).length}`);
    console.log(`   Freespins games: ${games.filter(game => game.has_freespins).length}`);

    // Show actual field presence
    console.log('\n📊 Field Presence Analysis:');
    const allFields = [...mandatoryFields, ...optionalMandatoryFields, ...optionalFields];
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

    // Show documentation compliance
    console.log('\n📋 Documentation Compliance:');
    const documentedFields = [
      'id', 'title', 'producer', 'category', 'theme', 'feature_group', 'customised',
      'devices', 'licenses', 'jackpot_type', 'forbid_bonus_play', 'has_freespins',
      'payout', 'hit_rate', 'volatility_rating', 'has_jackpot', 'lines', 'ways',
      'description', 'has_live', 'hd', 'accumulating', 'multiplier', 'released_at',
      'recalled_at', 'bonus_buy', 'restrictions'
    ];
    const presentDocumentedFields = documentedFields.filter(field => field in firstGame);
    const populatedDocumentedFields = presentDocumentedFields.filter(field => {
      const value = firstGame[field];
      return value !== null && value !== undefined && value !== '';
    });
    console.log(`   Documented fields present: ${presentDocumentedFields.length}/${documentedFields.length}`);
    console.log(`   Documented fields populated: ${populatedDocumentedFields.length}/${documentedFields.length}`);
    console.log(`   Compliance: ${Math.round((presentDocumentedFields.length / documentedFields.length) * 100)}%`);
    console.log(`   Data quality: ${Math.round((populatedDocumentedFields.length / documentedFields.length) * 100)}%`);

    if (mandatoryPassed) {
      console.log('\n🎉 All mandatory game fields validation passed!');
    } else {
      console.log('\n⚠️  Some mandatory fields are missing');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testGameFields(); 