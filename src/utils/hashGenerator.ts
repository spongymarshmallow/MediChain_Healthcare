export function generateHash(): string {
  const timestamp = Date.now().toString(16);
  const randomPart = Math.random().toString(16).slice(2, 10);
  return `0x${timestamp}${randomPart}`.padEnd(66, '0').slice(0, 66);
}

export function generateBlockHash(previousHash: string, timestamp: number, data: string): string {
  const combined = `${previousHash}${timestamp}${data}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hashHex}${'ab'.repeat(25)}`.slice(0, 66);
}

export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${timestamp}${random}`;
}

export function truncateHash(hash: string, length: number = 12): string {
  if (!hash || hash.length <= length) return hash;
  return `${hash.slice(0, length / 2)}...${hash.slice(-(length / 2))}`;
}
