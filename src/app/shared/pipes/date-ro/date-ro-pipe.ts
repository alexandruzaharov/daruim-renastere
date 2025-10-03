import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

@Pipe({
  name: 'dateRo'
})
export class DateRoPipe implements PipeTransform {

  transform(date: Date): string {
    return format(date, 'd MMMM yyyy', { locale: ro });
  }

}
