import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HmacService } from '../services/hmac.service';

@Injectable()
export class HmacGuard implements CanActivate {
  constructor(private readonly hmacService: HmacService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Get headers and body
    const signature = request.headers['x-request-sign'];
    const key = request.headers['allingame-key'];
    const body = JSON.stringify(request.body);

    console.log('🔐 HMAC Validation Debug:');
    console.log('📥 Incoming request headers:', {
      'x-request-sign': signature,
      'allingame-key': key,
      'content-type': request.headers['content-type'],
      'user-agent': request.headers['user-agent']
    });
    console.log('📥 Request body raw:', request.body);
    console.log('📥 Request body stringified:', body);
    console.log('🔑 Expected key:', process.env.KEY);

    // Validate key
    if (!key || key !== process.env.KEY) {
      console.error('❌ API Key validation failed:', {
        received: key,
        expected: process.env.KEY,
        match: key === process.env.KEY
      });
      throw new UnauthorizedException('Invalid API key');
    }

    // Validate signature
    if (!signature) {
      console.error('❌ Missing HMAC signature in headers');
      throw new UnauthorizedException('Missing HMAC signature');
    }

    const expectedSignature = this.hmacService.generateSignature(body);
    
    console.log('🔐 HMAC Signature validation:', {
      received: signature,
      expected: expectedSignature,
      match: signature === expectedSignature,
      bodyLength: body.length,
      privateKeySet: !!process.env.PRIVATE
    });

    if (signature !== expectedSignature) {
      console.error('❌ HMAC validation failed - detailed debug:', {
        expected: expectedSignature,
        received: signature,
        body: body,
        bodyBytes: Buffer.from(body).toString('hex'),
        privateKey: process.env.PRIVATE ? `${process.env.PRIVATE.substring(0, 8)}...` : 'NOT_SET'
      });
      throw new UnauthorizedException('Invalid HMAC signature');
    }

    console.log('✅ HMAC validation successful for request');
    return true;
  }
} 