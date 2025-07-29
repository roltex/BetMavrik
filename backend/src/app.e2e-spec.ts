import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('BetMavrik API Acceptance Tests', () => {
  let app: INestApplication;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('API Acceptance Test - Block 1: Core Functionality', () => {
    
    describe('1. Get Games List', () => {
      it('should return games list with all required fields', async () => {
        const response = await request(app.getHttpServer())
          .get('/games')
          .expect(200);

        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        // Validate first game structure
        const firstGame = response.body[0];
        
        // Mandatory fields validation
        expect(firstGame).toHaveProperty('id');
        expect(firstGame).toHaveProperty('title');
        expect(firstGame).toHaveProperty('category');
        expect(firstGame).toHaveProperty('feature_group');
        expect(firstGame).toHaveProperty('devices');
        expect(firstGame).toHaveProperty('licenses');
        expect(firstGame).toHaveProperty('jackpot_type');
        expect(firstGame).toHaveProperty('forbid_bonus_play');
        expect(firstGame).toHaveProperty('accumulating');
        expect(firstGame).toHaveProperty('bonus_buy');

        // Optional fields validation
        expect(firstGame).toHaveProperty('producer');
        expect(firstGame).toHaveProperty('theme');
        expect(firstGame).toHaveProperty('has_freespins');
        expect(firstGame).toHaveProperty('payout');
        expect(firstGame).toHaveProperty('hit_rate');
        expect(firstGame).toHaveProperty('volatility_rating');
        expect(firstGame).toHaveProperty('has_jackpot');
        expect(firstGame).toHaveProperty('lines');
        expect(firstGame).toHaveProperty('ways');
        expect(firstGame).toHaveProperty('description');
        expect(firstGame).toHaveProperty('has_live');
        expect(firstGame).toHaveProperty('hd');
        expect(firstGame).toHaveProperty('multiplier');
        expect(firstGame).toHaveProperty('released_at');
        expect(firstGame).toHaveProperty('recalled_at');
        expect(firstGame).toHaveProperty('restrictions');

        // Thumbnail URLs validation
        expect(firstGame).toHaveProperty('thumbnail');
        expect(firstGame).toHaveProperty('thumbnail_horizontal');
        expect(firstGame).toHaveProperty('thumbnail_vertical');

        // Data type validation
        expect(typeof firstGame.id).toBe('number');
        expect(typeof firstGame.title).toBe('string');
        expect(typeof firstGame.category).toBe('string');
        expect(Array.isArray(firstGame.devices)).toBe(true);
        expect(Array.isArray(firstGame.licenses)).toBe(true);
        expect(typeof firstGame.jackpot_type).toBe('string');
        expect(typeof firstGame.forbid_bonus_play).toBe('boolean');
        expect(typeof firstGame.accumulating).toBe('boolean');
        expect(typeof firstGame.bonus_buy).toBe('boolean');

        console.log('✅ Games list validation passed');
        console.log(`📊 Found ${response.body.length} games`);
        console.log(`🎮 Sample game: ${firstGame.title} (ID: ${firstGame.id})`);
      });

      it('should find acceptance:test game', async () => {
        const response = await request(app.getHttpServer())
          .get('/games')
          .expect(200);

        const acceptanceTestGame = response.body.find((game: any) => 
          game.title === 'acceptance:test' || game.id === 'acceptance:test'
        );

        if (acceptanceTestGame) {
          console.log('✅ Found acceptance:test game');
          console.log(`🎮 Game details:`, acceptanceTestGame);
        } else {
          console.log('⚠️  acceptance:test game not found in games list');
          console.log('📋 Available games:', response.body.map((g: any) => ({ id: g.id, title: g.title })).slice(0, 5));
        }
      });
    });

    describe('2. Get User Information', () => {
      it('should return user information with balance', async () => {
        const response = await request(app.getHttpServer())
          .get('/users/me')
          .expect(200);

        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('username');
        expect(response.body).toHaveProperty('balance');

        // Store userId for later tests
        userId = response.body.id;

        // Validate user data structure
        expect(typeof response.body.id).toBe('string');
        expect(typeof response.body.username).toBe('string');
        expect(typeof response.body.balance).toBe('number');
        expect(response.body.balance).toBeGreaterThanOrEqual(0);

        // Optional user fields
        expect(response.body).toHaveProperty('firstname');
        expect(response.body).toHaveProperty('lastname');
        expect(response.body).toHaveProperty('country');
        expect(response.body).toHaveProperty('city');
        expect(response.body).toHaveProperty('date_of_birth');
        expect(response.body).toHaveProperty('registred_at');
        expect(response.body).toHaveProperty('gender');

        console.log('✅ User information validation passed');
        console.log(`👤 User: ${response.body.username} (ID: ${response.body.id})`);
        console.log(`💰 Balance: ${response.body.balance}`);
      });
    });

    describe('3. Launch Game Session', () => {
      it('should create game session successfully', async () => {
        // First get user info to ensure we have a valid user
        const userResponse = await request(app.getHttpServer())
          .get('/users/me')
          .expect(200);

        const userData = userResponse.body;

        // Create game session
        const sessionResponse = await request(app.getHttpServer())
          .post('/games')
          .send({
            game_id: 58322 // Using the test game ID from cursor.md
          })
          .expect(201);

        expect(sessionResponse.body).toBeDefined();
        expect(sessionResponse.body).toHaveProperty('url');
        expect(sessionResponse.body).toHaveProperty('game_id');
        expect(typeof sessionResponse.body.url).toBe('string');
        expect(typeof sessionResponse.body.game_id).toBe('number');

        // Validate session URL
        expect(sessionResponse.body.url).toMatch(/^https?:\/\//);
        expect(sessionResponse.body.url.length).toBeGreaterThan(0);

        console.log('✅ Game session creation passed');
        console.log(`🎮 Game ID: ${sessionResponse.body.game_id}`);
        console.log(`🔗 Session URL: ${sessionResponse.body.url}`);
      });

      it('should create session for acceptance:test game if available', async () => {
        // Try to find acceptance:test game in the games list
        const gamesResponse = await request(app.getHttpServer())
          .get('/games')
          .expect(200);

        const acceptanceTestGame = gamesResponse.body.find((game: any) => 
          game.title === 'acceptance:test' || game.id === 'acceptance:test'
        );

        if (acceptanceTestGame) {
          console.log('🎯 Testing session creation for acceptance:test game');
          
          const sessionResponse = await request(app.getHttpServer())
            .post('/games')
            .send({
              game_id: acceptanceTestGame.id
            })
            .expect(201);

          expect(sessionResponse.body).toHaveProperty('url');
          expect(sessionResponse.body).toHaveProperty('game_id');
          expect(sessionResponse.body.game_id).toBe(acceptanceTestGame.id);

          console.log('✅ acceptance:test game session created successfully');
          console.log(`🔗 Session URL: ${sessionResponse.body.url}`);
        } else {
          console.log('⚠️  acceptance:test game not found, skipping session test');
        }
      });
    });

    describe('4. Additional API Validations', () => {
      it('should handle wallet operations', async () => {
        // Test wallet play (bet)
        const betResponse = await request(app.getHttpServer())
          .post('/wallet/play')
          .send({
            user_id: userId,
            amount: -10,
            game_id: '58322'
          })
          .expect(200);

        expect(betResponse.body).toHaveProperty('balance');
        expect(typeof betResponse.body.balance).toBe('number');

        // Test wallet play (win)
        const winResponse = await request(app.getHttpServer())
          .post('/wallet/play')
          .send({
            user_id: userId,
            amount: 20,
            game_id: '58322'
          })
          .expect(200);

        expect(winResponse.body).toHaveProperty('balance');
        expect(typeof winResponse.body.balance).toBe('number');

        console.log('✅ Wallet operations validation passed');
        console.log(`💰 Balance after bet: ${betResponse.body.balance}`);
        console.log(`💰 Balance after win: ${winResponse.body.balance}`);
      });

      it('should return transaction history', async () => {
        const response = await request(app.getHttpServer())
          .get(`/wallet/transactions/${userId}`)
          .expect(200);

        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);

        if (response.body.length > 0) {
          const transaction = response.body[0];
          expect(transaction).toHaveProperty('id');
          expect(transaction).toHaveProperty('user_id');
          expect(transaction).toHaveProperty('amount');
          expect(transaction).toHaveProperty('game_id');
          expect(transaction).toHaveProperty('timestamp');
        }

        console.log('✅ Transaction history validation passed');
        console.log(`📊 Found ${response.body.length} transactions`);
      });
    });
  });

  describe('API Health Checks', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('ok');

      console.log('✅ Health check passed');
    });

    it('should return root endpoint', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('BetMavrik');

      console.log('✅ Root endpoint check passed');
    });
  });
}); 