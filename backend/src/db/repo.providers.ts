import { DataSource } from 'typeorm';
import { Gateway } from '../gateways/entities/gateway.entity';

export const repoProviders = [
  {
    provide: 'GATEWAY_REPO',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Gateway),
    inject: ['DATA_SOURCE'],
  },
];
