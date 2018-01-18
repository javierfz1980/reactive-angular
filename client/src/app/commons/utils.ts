export function getDifferencesBetween<T>(origin: T[], destiny: T[]): T[] {
  return origin.filter((originItem: T) => destiny.indexOf(originItem) < 0)
}

