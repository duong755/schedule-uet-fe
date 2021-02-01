export function convertPeriodsFromStringToArray(str: string): number[] {
    const PERIOD_REGEX = new RegExp('^(\\d{1,2})-(\\d{1,2})$');
    if (PERIOD_REGEX.test(str)) {
        str.match(PERIOD_REGEX);
        const first = Number(RegExp.$1);
        const last = Number(RegExp.$2);
        if (first === last) {
            return [first];
        }
        const periods: number[] = [];
        for (let i = first; i <= last; i += (last - first) / Math.abs(last - first)) {
            periods.push(i);
        }
        return periods;
    }
    return [];
};