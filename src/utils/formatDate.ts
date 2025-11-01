/**
 * Formats a date string into a human-readable format with optional relative time display.
 * Supports both ISO date strings and date-only strings (YYYY-MM-DD).
 *
 * @param date - The date string to format. Can be ISO format (with time) or date-only format (YYYY-MM-DD)
 * @param includeRelative - Whether to include relative time information (e.g., "2y ago") alongside the full date
 * @returns A formatted date string. If includeRelative is false, returns only the full date (e.g., "October 31, 2024").
 *          If includeRelative is true, returns both full date and relative time (e.g., "October 31, 2024 (2y ago)")
 *
 * @example
 * ```typescript
 * // Full date only
 * formatDate("2023-10-31") // "October 31, 2023"
 *
 * // With relative time
 * formatDate("2023-10-31", true) // "October 31, 2023 (1y ago)"
 *
 * // ISO date string
 * formatDate("2024-10-31T10:30:00Z") // "October 31, 2024"
 *
 * // Today's date
 * formatDate("2024-10-31", true) // "October 31, 2024 (Today)"
 * ```
 */
export function formatDate(date: string, includeRelative = false) {
    const currentDate = new Date();

    let dateString = date;
    if (!dateString.includes("T")) {
        dateString = `${dateString}T00:00:00`;
    }

    const targetDate = new Date(dateString);
    const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
    const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
    const daysAgo = currentDate.getDate() - targetDate.getDate();

    let formattedDate = "";

    if (yearsAgo > 0) {
        formattedDate = `${yearsAgo}y ago`;
    } else if (monthsAgo > 0) {
        formattedDate = `${monthsAgo}mo ago`;
    } else if (daysAgo > 0) {
        formattedDate = `${daysAgo}d ago`;
    } else {
        formattedDate = "Today";
    }

    const fullDate = targetDate.toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    if (!includeRelative) {
        return fullDate;
    }

    return `${fullDate} (${formattedDate})`;
}
