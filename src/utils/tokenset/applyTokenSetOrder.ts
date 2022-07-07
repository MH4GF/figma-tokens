import type { AnyTokenList } from '@/types/tokens';

export function applyTokenSetOrder(tokenSets: Record<string, AnyTokenList> = {}, order: (string[] | null | undefined) = null) {
  return Object.fromEntries(
    Object.entries(tokenSets).sort((a, b) => {
      const indexOfA = order?.indexOf(a[0]) ?? -1;
      const indexOfB = order?.indexOf(b[0]) ?? -1;
      if (indexOfA === -1 && indexOfB > -1) return 1;
      if (indexOfA > -1 && indexOfB === -1) return -1;
      if (indexOfA === -1 && indexOfB === -1) return a[0] < b[0] ? -1 : 1;
      return indexOfA < indexOfB ? -1 : 1;
    }),
  );
}