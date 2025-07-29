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

    // Validate key
    if (!key || key !== process.env.KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Validate signature
    if (!signature) {
      throw new UnauthorizedException('Missing HMAC signature');
    }

    const expectedSignature = this.hmacService.generateSignature(body);
    
    if (signature !== expectedSignature) {
      console.error('HMAC validation failed:', {
        expected: expectedSignature,
        received: signature,
        body: body
      });
      throw new UnauthorizedException('Invalid HMAC signature');
    }

    console.log('✅ HMAC validation successful');
    return true;
  }
} 