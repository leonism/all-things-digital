import type { Ref, ComputedRef } from 'vue';

export interface PaginationReturn {
  currentPage: Ref<number>;
  totalPages: ComputedRef<number>;
  goToPage: (page: number) => void;
}

export declare function usePagination(
  totalItems: ComputedRef<number>,
  itemsPerPage: number
): PaginationReturn;