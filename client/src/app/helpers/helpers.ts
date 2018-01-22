export function getDifferencesBetween<T>(origin: T[], destiny: T[]): T[] {
  return  origin ? origin.filter((originItem: T) => destiny && destiny.indexOf(originItem) < 0) : destiny;
}

export function objectCopy<T>(source: T): T {
  return Object.assign({}, source);
}

