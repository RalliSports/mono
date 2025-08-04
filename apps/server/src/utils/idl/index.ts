import { Idl } from '@coral-xyz/anchor';
import idlJson from './ralli_bet.json';

// TypeScript will infer the correct structure from the JSON import
export const IDL: Idl = idlJson as Idl;

