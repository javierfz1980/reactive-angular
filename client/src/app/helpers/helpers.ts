import {globalProperties} from "../../environments/properties";

export function getDifferencesBetween<T>(origin: T[], destiny: T[]): T[] {
  return  origin ? origin.filter((originItem: T) => destiny && destiny.indexOf(originItem) < 0) : destiny;
}

export function objectCopy<T>(source: T): T {
  return Object.assign({}, source);
}

export function randomBetween(min: number, max: number) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

export function getFakedDelay(): number {
  return globalProperties.localDev ? randomBetween(0, globalProperties.maxFakedTime) * 1000 : 0;
}

export function getDateString(dateString: string): string {
  return dateString ? new Date(dateString).toISOString().slice(0,10) : "";
}

