export interface IDataAdapter<T1, T2> {
	transform(input: T1): T2;
}
