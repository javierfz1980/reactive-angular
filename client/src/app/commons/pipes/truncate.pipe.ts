import {Pipe} from "@angular/core";

@Pipe({
  name: 'truncate'
})
export class TruncatePipe {

  transform(value: string, limitParam?: number, trailParam?: string) : string {
    let limit: number = limitParam ? limitParam : 50;
    let trail: string = trailParam ? trailParam : "...";

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
