export interface IPagedResult<TEntity> {
	total: number;
	items: TEntity[];
}
