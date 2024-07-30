import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, formatNumber, getCurrencySymbol } from '@angular/common';


@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number | string, currencyCode: string = 'BRL', display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = false, digitsInfo: string = '1.2-2', locale: string = 'pt-BR'): string {
    const formattedValue = formatNumber(Number(value), locale, digitsInfo);

    if (display) {
      const symbol = getCurrencySymbol(currencyCode, 'wide');
      return `${symbol} ${formattedValue}`;
    }

    return formattedValue;
  }
}
