import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'dateFilter'
})
export class SearchDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }

    return value.filter((val) => {
      const rVal = (val.date.includes(args));
      return rVal;
    });

  }
}

