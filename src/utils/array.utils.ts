export abstract class ArrayUtils {
	public static isNullOrEmpty<T>(array: Array<T>): boolean {
		if (typeof array != 'undefined' && array != null && array.length != null && array.length > 0) {
			return false;
		}

		return true;
	}
}
