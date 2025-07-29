import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { HmacService } from '../../common/services/hmac.service';
import { GameDto, CreateGameSessionDto, GameSessionDto } from '../../common/dto/game.dto';

@Injectable()
export class GamesService {
  private readonly gcpUrl: string;
  private readonly returnUrl: string;
  private gamesCache: GameDto[] = [];
  private cacheExpiry: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(private readonly hmacService: HmacService) {
    this.gcpUrl = process.env.GCP_URL || '';
    this.returnUrl = process.env.RETURN_URL || 'https://betmavrik-frontend.up.railway.app/casino';
    console.log('🔧 GamesService initialized with:');
    console.log('  GCP_URL:', this.gcpUrl);
    console.log('  RETURN_URL:', this.returnUrl);
    console.log('  KEY:', process.env.KEY ? 'SET' : 'NOT SET');
    console.log('  PRIVATE:', process.env.PRIVATE ? 'SET' : 'NOT SET');
  }

  async getGames(): Promise<GameDto[]> {
    // Check if cache is still valid
    if (this.gamesCache.length > 0 && Date.now() < this.cacheExpiry) {
      return this.gamesCache;
    }

    try {
      const headers = this.hmacService.getHeaders();
      const response = await axios.get(`${this.gcpUrl}games`, { headers });
      
      if (response.data && Array.isArray(response.data)) {
        this.gamesCache = response.data.map((game: any) => ({
          // Mandatory fields (always included)
          id: game.id,
          title: game.title,
          category: game.category,
          feature_group: game.feature_group,
          devices: game.devices,
          licenses: game.licenses,
          jackpot_type: game.jackpot_type,
          
          // Optional mandatory fields (always included, can be null)
          customised: game.customised ?? null,
          forbid_bonus_play: game.forbid_bonus_play ?? null,
          accumulating: game.accumulating ?? null,
          bonus_buy: game.bonus_buy ?? null,
          
          // Optional fields (always included, can be null)
          producer: game.producer ?? null,
          theme: game.theme ?? null,
          has_freespins: game.has_freespins ?? null,
          payout: game.payout ?? null,
          hit_rate: game.hit_rate ?? null,
          volatility_rating: game.volatility_rating ?? null,
          has_jackpot: game.has_jackpot ?? null,
          lines: game.lines ?? null,
          ways: game.ways ?? null,
          description: game.description ?? null,
          has_live: game.has_live ?? null,
          hd: game.hd ?? null,
          multiplier: game.multiplier ?? null,
          released_at: game.released_at ?? null,
          recalled_at: game.recalled_at ?? null,
          restrictions: game.restrictions ?? {},
          
          // Thumbnail URLs (always included)
          thumbnail: `https://thumb.all-ingame.com/iv2/${game.id}.png`,
          thumbnail_horizontal: `https://thumb.all-ingame.com/horizontal/${game.id}.png`,
          thumbnail_vertical: `https://thumb.all-ingame.com/vertical/${game.id}.png`,
        }));
        
        this.cacheExpiry = Date.now() + this.CACHE_TTL;
        return this.gamesCache;
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch games from GCP:', error);
      throw new HttpException(
        'Failed to fetch games',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createGameSession(sessionDto: CreateGameSessionDto, userData: any): Promise<GameSessionDto> {
    const sessionData = {
      game_id: sessionDto.game_id,
      locale: 'en',
      client_type: 'desktop',
      ip: '127.0.0.1',
      currency: 'TRY',
      rtp: 90,
      url: {
        return_url: this.returnUrl,
        deposit_url: this.returnUrl
      },
      user: {
        user_id: userData.id,
        nickname: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        country: userData.country,
        city: userData.city,
        date_of_birth: userData.date_of_birth,
        registered_at: userData.registered_at,
        gender: userData.gender
      }
    };

    try {
      const body = JSON.stringify(sessionData);
      const headers = this.hmacService.getHeaders(body);
      
      console.log('🎮 Creating session with data:', JSON.stringify(sessionData, null, 2));
      console.log('📡 Request headers:', headers);
      
      const response = await axios.post(
        `${this.gcpUrl}session`,
        body,
        { headers }
      );
      
      if (response.data && response.data.url) {
        console.log(`✅ Session created successfully for game ${sessionDto.game_id}`);
        return {
          url: response.data.url,
          game_id: sessionDto.game_id,
        };
      }
      
      throw new HttpException(
        'Invalid response from GCP',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.error('❌ Failed to create game session:', error.message);
      if (error.response) {
        console.error('📊 Response status:', error.response.status);
        console.error('📋 Response data:', error.response.data);
      }
      console.error('📤 Request data:', JSON.stringify(sessionData, null, 2));
      throw new HttpException(
        'Failed to create game session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 