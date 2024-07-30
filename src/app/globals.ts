import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpParams } from '@angular/common/http';
//import { ColumnField, FilterField, TypeField } from '../components/common/default-list/models/models';

@Injectable()
export class Globals {
  logged = false;
  sidebar = false;
  admin = false;

  masks = {
    cpf: [
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
    cnpj: [
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '.',
      /\d/,
      /\d/,
      /\d/,
      '/',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
    ],
    hora: [/\d/, /\d/, ':', /\d/, /\d/],
    data: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    phone: [
      '(',
      /[1-9]/,
      /\d/,
      ')',
      ' ',
      /\d/,
      /\d/,
      /\d/,
      '-',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ],
  };

  /* Paginator */
  pageSizeOptions: number[] = [10, 20, 30, 50];
  pageSizeDefault = 10;
  pageIndexDefault = 0;

  /**
   * Config global do toaster
   */
  // public configToaster: ToasterConfig = new ToasterConfig({
  //   timeout: 6000,
  //   animation: 'flyRight',
  // });

  // formatValue(row: any, column: ColumnField) {
  //   switch (column.type) {
  //     case TypeField.CURRENCY:
  //       return this.getNumberFormatCurrency(row[column.id]);
  //     case TypeField.DATE:
  //       return this.stringDateToFormat(row[column.id]);
  //     case TypeField.DATE_TIME:
  //       return this.stringDateTimeToFormat(row[column.id]);
  //     case TypeField.BOOLEAN:
  //       return row[column.id] ? 'Sim' : 'Não';
  //     default:
  //       return row[column.id];
  //   }
  // }


  mascaraCpfCnpj = (rawValue: { replace: (arg0: RegExp, arg1: string) => { (): any; new(): any; length: number; }; }) => {
    if (rawValue.replace(/[^0-9]/g, '').length <= 11) {
      return [
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
      ];
    } else {
      return [
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
      ];
    }
    // tslint:disable-next-line: semicolon
  };

  configCurrency() {
    return { prefix: 'R$ ', thousands: '.', decimal: ',' };
  }

  configPercentual(precision: number = 2) {
    return {
      prefix: '',
      thousands: '.',
      decimal: ',',
      suffix: ' %',
      precision,
    };
  }

  configInt(precision: number = 0) {
    return {
      prefix: '',
      thousands: '.',
      decimal: ',',
      suffix: '',
      precision,
    };
  }

  solveSortDirections(sortDirection: string) {
    if (sortDirection) {
      if (sortDirection === 'desc') {
        return '-';
      }
    }
    // Default is asc empty meaning asc
    return '';
  }

  stringDateToFormat(date: string, outputFormat: string = 'DD/MM/YYYY') {
    if (date) {
      return moment(date).format(outputFormat);
    }
    return '';
  }

  stringDateTimeToFormat(
    date: string,
    outputFormat: string = 'DD/MM/YYYY HH:mm'
  ) {
    return this.stringDateToFormat(date, outputFormat);
  }

  convertStringToDate(date: string) {
    if (date) {
      return moment(date).toDate();
    }
    return null;
  }

  isDate(value: any): value is Date {
    return Object.prototype.toString.call(value) === '[object Date]';
  }

  isEmptyString(value: string) {
    return !value || !value.length;
  }

  getNumberFormatCurrency(nr: number) {
    return nr.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL',
    });
    // return number.toLocaleString();
  }

  formatDateTime(date: moment.MomentInput) {
    return moment(date).format('DD/MM/YYYY HH:mm');
  }

  formatDate(date: moment.MomentInput) {
    return moment(date).format('DD/MM/YYYY');
  }

  formatCurrency(nu: { toLocaleString: (arg0: string, arg1: { style: string; currency: string; }) => any; }) {
    return nu.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  forDtTmToSave(date: moment.MomentInput) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ss');
  }

  forDtToSave(date: moment.MomentInput) {
    return moment(date).format('YYYY-MM-DD');
  }

  updateFilter(name: string, filter: any) {
    sessionStorage.setItem(name, JSON.stringify(filter));
  }

  // getFilter(name: string): FilterField[] {
  //   const fil = sessionStorage.getItem(name);
  //   if (fil) {
  //     return JSON.parse(fil);
  //   }
  //   return [];
  // }

  public getParams(query: any) {
    let params: HttpParams = new HttpParams();
    for (const key of Object.keys(query)) {
      if (query[key] !== undefined && query[key] !== null) {
        if (query[key] instanceof Array) {
          let i = 0;
          query[key].forEach((item: string | number | boolean) => {
            if (typeof item === 'object') {
              const keysI: string[] = Object.keys(item);
              keysI.forEach((itm) => {
                const itmKey = `${key.toString()}[${i}].${itm.toString()}`;
                const itmVal = query[key][i][itm.toString()];
                params = params.append(itmKey, itmVal);
              });
              i++;
            } else {
              params = params.append(`${key.toString()}`, item);
            }
          });
        } else {
          params = params.append(key.toString(), query[key]);
        }
      }
    }
    return params;
  }
}
