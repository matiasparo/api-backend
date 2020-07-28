export type IPagination<T extends {}> = T & {
	pageNumber: number;
	pageSize: number;
};
