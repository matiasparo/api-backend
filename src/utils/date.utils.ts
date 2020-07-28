import formatDate from 'intl-dateformat';

export enum DateFormat {
	/**
	 * ie: 6/15/19, 10:54 PM
	 */
	short = 'short',

	/**
	 * ie: Jun 15, 2019, 10:54:25 PM
	 */
	medium = 'medium',

	/**
	 * ie: June 15, 2019 at 10:54:25 PM
	 */
	long = 'long',

	/**
	 * ie: Saturday, June 15, 2019 at 10:54:25 PM
	 */
	full = 'full',

	/**
	 * ie: 06/15/19
	 */
	shortDate = 'shortDate',

	/**
	 * ie: June 15, 2019
	 */
	mediumDate = 'mediumDate',

	/**
	 * ie: Saturday, June 15, 2019
	 */
	longDate = 'longDate',

	/**
	 * ie: Saturday, June 15, 2019
	 */
	fullDate = 'fullDate',

	/**
	 * ie: 10:54 PM
	 */
	shortTime = 'shortTime',

	/**
	 * ie: 10:54:25 PM
	 */
	longTime = 'longTime',
}

export abstract class DateUtils {
	public static formatDate(date: Date, format: DateFormat): string {
		if (!date) {
			return '';
		}

		const normalizedDate = new Date(date);

		switch (format) {
			case DateFormat.short:
				// ie: 6/15/19, 10:54 PM
				return formatDate(normalizedDate, 'MM/DD/YY, hh:mm A');
			case DateFormat.medium:
				// ie: Jun 15, 2019, 10:54:25 PM
				return formatDate(normalizedDate, 'MMM DD, YYYY, hh:mm:ss A');
			case DateFormat.long:
				// ie:  June 15, 2019 at 10:54:25 PM
				return formatDate(normalizedDate, 'MMMM DD, YYYY at hh:mm:ss A');
			case DateFormat.full:
				// ie:  Saturday, June 15, 2019 at 10:54:25 PM
				return formatDate(normalizedDate, 'dddd, MMMM DD, YYYY at hh:mm:ss A');
			case DateFormat.shortDate:
				// ie:  06/15/19
				return formatDate(normalizedDate, 'MM/DD/YY');
			case DateFormat.mediumDate:
				// ie:  Jun 15, 2019
				return formatDate(normalizedDate, 'MMM DD, YYYY');
			case DateFormat.longDate:
				// ie:  June 15, 2019
				return formatDate(normalizedDate, 'MMMM DD, YYYY');
			case DateFormat.fullDate:
				// ie:  Saturday, June 15, 2019
				return formatDate(normalizedDate, 'dddd, MMMM DD, YYYY');
			case DateFormat.shortTime:
				// ie: 10:54 PM
				return formatDate(normalizedDate, 'hh:mm A');
			case DateFormat.longTime:
				// ie: 10:54:25 PM
				return formatDate(normalizedDate, 'hh:mm:ss A');

			default:
				return normalizedDate.toDateString();
		}
	}
}
