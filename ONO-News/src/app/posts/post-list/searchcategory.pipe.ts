import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'categoryFilter'
})
export class SearchCategoryPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }

    return value.filter((val) => {
      const rVal = (val.category.toLocaleLowerCase().includes(args));
      return rVal;
    });

  }
}
