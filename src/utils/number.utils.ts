export abstract class NumberUtils {
	public static roundTwoDecimals(value: number): number {
		if (!isNaN(value)) {
			return Math.round((value + Number.EPSILON) * 100) / 100;
		} else {
			return NaN;
		}
	}

	public static roundThreeDecimals(value: number): number {
		if (!isNaN(value)) {
			return Math.round((value + Number.EPSILON) * 1000) / 1000;
		} else {
			return NaN;
		}
	}
}
