import moment from 'moment'

export const useTimeFormat = (input: moment.MomentInput): string => {
    var day = moment(input)
    if (day.year() == 1 && day.month() == 0 && day.day() == 1) {
        return "-"
    }
    return day.format('lll')
}

export const useShortTimeFormat = (input: moment.MomentInput): string => {
    var day = moment(input)
    if (day.year() == 1 && day.month() == 0 && day.day() == 1) {
        return "-"
    }
    return day.format('L')
}
