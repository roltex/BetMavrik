import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Game, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

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
      console.log('🚀 Starting game:', gameId);
      const response = await axios.post(`${API_BASE_URL}/games`, { game_id: gameId });
      return response.data.url;
    } catch (error) {
      console.error('❌ Error starting game:', error);
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