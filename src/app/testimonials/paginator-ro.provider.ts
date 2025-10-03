import { MatPaginatorIntl } from '@angular/material/paginator';

export function getRoPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Elemente pe pagină:';
  paginatorIntl.nextPageLabel = 'Pagina următoare';
  paginatorIntl.previousPageLabel = 'Pagina anterioară';
  paginatorIntl.firstPageLabel = 'Prima pagină';
  paginatorIntl.lastPageLabel = 'Ultima pagină';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) return `0 din ${length}`;
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} din ${length}`;
  };

  return paginatorIntl;
}
