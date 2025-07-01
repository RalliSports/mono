import { Inject } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from './database.provider';


export const Drizzle = () => Inject(DRIZZLE_PROVIDER);