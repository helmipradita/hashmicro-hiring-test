export interface Pageable {
  page: number;
  size: number;
}

export interface PageResponse<T> {
  data: T[];
  paging: {
    current_page: number;
    total_page: number;
    size: number;
    total_data: number;
  };
}
