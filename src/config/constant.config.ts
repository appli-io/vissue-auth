import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const USER_CLIENT_REGISTRY: ClientProviderOptions = {
  name: 'USER_CLIENT',
  transport: Transport.TCP,
  options: {
    host: 'localhost',
    port: 4010
  }
};
