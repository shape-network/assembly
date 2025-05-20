import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Hex } from 'viem';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function abbreviateHash(
  hash: string | Buffer,
  prefixLength: number = 4,
  suffixLength: number = 4
): string {
  let hashString: string;

  if (Buffer.isBuffer(hash)) {
    hashString = hash.toString('hex');
  } else if (typeof hash === 'string') {
    hashString = hash.startsWith('0x') ? hash.slice(2) : hash;
  } else {
    throw new Error('Invalid hash format. Expected string or Buffer.');
  }

  if (hashString.length < prefixLength + suffixLength) {
    throw new Error('Hash is too short to abbreviate.');
  }

  const prefix = hashString.slice(0, prefixLength);
  const suffix = hashString.slice(-suffixLength);

  return `0x${prefix}...${suffix}`;
}

export function universeHashToSeed(universeHash: string): string {
  return universeHash.slice(2);
}

export function universeSeedToHash(universeSeed: string): Hex {
  return `0x${universeSeed}`;
}

export function isNotNullish<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

export function isSameAddress(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
