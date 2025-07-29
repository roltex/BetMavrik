const fs = require('fs');
const path = require('path');

console.log('🔍 Checking BetMavrik Backend Structure...\n');

// Check if package.json exists
const packageJsonPath = path.join(__dirname, '../../package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json found');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`📦 Project: ${packageJson.name}`);
  console.log(`📝 Version: ${packageJson.version}`);
} else {
  console.log('❌ package.json not found');
}

// Check key directories
const directories = [
  'src',
  'src/common',
  'src/common/dto',
  'src/common/services',
  'src/games',
  'src/games/controllers',
  'src/games/services',
  'src/users',
  'src/users/controllers',
  'src/users/services',
  'src/wallet',
  'src/wallet/controllers',
  'src/wallet/services',
  'src/websocket',
  'tests',
  'tests/integration',
  'tests/unit',
  'tests/e2e',
  'tests/setup'
];

console.log('\n📁 Checking directory structure:');
directories.forEach(dir => {
  const fullPath = path.join(__dirname, '../../', dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - missing`);
  }
});

// Check key files
const files = [
  'src/main.ts',
  'src/app.module.ts',
  'src/app.controller.ts',
  'src/common/dto/game.dto.ts',
  'src/common/dto/wallet.dto.ts',
  'src/common/dto/user.dto.ts',
  'src/common/services/hmac.service.ts',
  'src/games/games.module.ts',
  'src/games/controllers/games.controller.ts',
  'src/games/services/games.service.ts',
  'src/users/users.module.ts',
  'src/users/controllers/users.controller.ts',
  'src/users/services/users.service.ts',
  'src/wallet/wallet.module.ts',
  'src/wallet/controllers/wallet.controller.ts',
  'src/wallet/services/balance.service.ts',
  'src/websocket/websocket.gateway.ts',
  'env.example',
  'tsconfig.json',
  'nest-cli.json',
  'tests/integration/acceptance-test.js',
  'tests/integration/endpoints-test.js',
  'tests/integration/game-fields-test.js',
  'tests/integration/session-test.js',
  'tests/setup/project-setup-test.js'
];

console.log('\n📄 Checking key files:');
files.forEach(file => {
  const fullPath = path.join(__dirname, '../../', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - missing`);
  }
});

// Validate Game DTO structure
console.log('\n🎮 Validating Game DTO Structure:');
try {
  const gameDtoPath = path.join(__dirname, '../../src/common/dto/game.dto.ts');
  if (fs.existsSync(gameDtoPath)) {
    const gameDtoContent = fs.readFileSync(gameDtoPath, 'utf8');
    
    // Check for mandatory fields
    const mandatoryFields = ['id', 'title', 'category', 'feature_group', 'devices', 'licenses', 'jackpot_type', 'forbid_bonus_play', 'accumulating', 'bonus_buy'];
    const missingFields = mandatoryFields.filter(field => !gameDtoContent.includes(`${field}:`));
    
    if (missingFields.length === 0) {
      console.log('✅ All mandatory game fields present in DTO');
    } else {
      console.log(`❌ Missing mandatory fields: ${missingFields.join(', ')}`);
    }
    
    // Check for optional fields
    const optionalFields = ['producer', 'theme', 'has_freespins', 'payout', 'hit_rate', 'volatility_rating', 'has_jackpot', 'lines', 'ways', 'description', 'has_live', 'hd', 'multiplier', 'released_at', 'recalled_at', 'restrictions'];
    const presentOptionalFields = optionalFields.filter(field => gameDtoContent.includes(`${field}:`));
    console.log(`📊 Present optional fields: ${presentOptionalFields.length}/${optionalFields.length}`);
    
    // Check for thumbnail fields
    const thumbnailFields = ['thumbnail', 'thumbnail_horizontal', 'thumbnail_vertical'];
    const presentThumbnailFields = thumbnailFields.filter(field => gameDtoContent.includes(`${field}:`));
    console.log(`🖼️  Present thumbnail fields: ${presentThumbnailFields.length}/${thumbnailFields.length}`);
    
  } else {
    console.log('❌ Game DTO file not found');
  }
} catch (error) {
  console.log('❌ Error validating Game DTO:', error.message);
}

console.log('\n🎯 Backend Structure Check Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Run: npm install');
console.log('2. Copy env.example to .env and configure');
console.log('3. Start Redis server');
console.log('4. Run: npm run start:dev');
console.log('5. Test with: npm run test:acceptance');
console.log('6. Test game fields: npm run test:game-fields'); 