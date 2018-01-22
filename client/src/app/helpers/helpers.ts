export function getDifferencesBetween<T>(origin: T[], destiny: T[]): T[] {
  return origin.filter((originItem: T) => destiny.indexOf(originItem) < 0)
}

export function objectCopy<T>(source: T): T {
  return Object.assign({}, source);
}

