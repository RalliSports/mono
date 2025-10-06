import { Idl } from '@coral-xyz/anchor';
import idlJson from './ralli_bet.json';
import idlJson_new from './ralli_bet_new.json';

// TypeScript will infer the correct structure from the JSON import
export const IDL: Idl = idlJson as Idl;
export const IDL_New: Idl = idlJson_new as Idl;

