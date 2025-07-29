import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HmacService {
  private readonly key: string;
  private readonly privateKey: string;

  constructor() {
    this.key = process.env.KEY || '';
    this.privateKey = process.env.PRIVATE || '';
  }

  generateSignature(body: string): string {
    return crypto
      .createHmac('sha256', this.privateKey)
      .update(body)
      .digest('hex');
  }

  getHeaders(body: string = ''): Record<string, string> {
    return {
      'X-REQUEST-SIGN': this.generateSignature(body),
      'allingame-key': this.key,
      'Content-Type': 'application/json',
    };
  }
} 