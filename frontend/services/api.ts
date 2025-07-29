import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Game, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://betmavrik-backend.up.railway.app';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://betmavrik-backend.up.railway.app';

console.log('🔧 API Configuration:', { API_BASE_URL, WS_URL });

class ApiService {
  private socket: Socket | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebSocket();
    }
  }

  private initializeWebSocket() {
    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket:', WS_URL);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    this.socket.on('balanceUpdate', (data: { userId: string; balance: number }) => {
      window.dispatchEvent(new CustomEvent('balance_update', { detail: data }));
    });
  }

  async getGames(): Promise<Game[]> {
    try {
      console.log('🎮 Fetching games from:', `${API_BASE_URL}/games`);
      const response = await axios.get(`${API_BASE_URL}/games`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching games:', error);
      return [];
    }
  }

  async getUser(): Promise<User> {
    try {
      console.log('👤 Fetching user from:', `${API_BASE_URL}/users/me`);
      const response = await axios.get(`${API_BASE_URL}/users/me`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  }

  async startGame(gameId: number): Promise<string> {
    try {
      console.log('🚀 Starting game with ID:', gameId);
      console.log('📡 API endpoint:', `${API_BASE_URL}/games`);
      
      const requestData = { game_id: gameId };
      console.log('📤 Request data:', requestData);
      
      const response = await axios.post(`${API_BASE_URL}/games`, requestData);
      
      console.log('📥 Full response:', response);
      console.log('🎮 Game URL:', response.data.url);
      
      if (!response.data.url) {
        throw new Error('No URL received in response');
      }
      
      return response.data.url;
    } catch (error) {
      console.error('❌ Error starting game:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data: unknown } };
        console.error('❌ Server response status:', axiosError.response.status);
        console.error('❌ Server response data:', axiosError.response.data);
      }
      
      throw error;
    }
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const apiService = new ApiService(); 