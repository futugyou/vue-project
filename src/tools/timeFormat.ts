import moment from 'moment'

export const timeFormat = (input: moment.MomentInput): string => {
    var day = moment(input)
    if (!day.isValid()) {
        return "-"
    }
    if (day.year() == 1 && day.month() == 0 && day.day() == 1) {
        return "-"
    }
    return day.format('lll')
}

export const shortTimeFormat = (input: moment.MomentInput): string => {
    var day = moment(input)
    if (day.year() == 1 && day.month() == 0 && day.day() == 1) {
        return "-"
    }
    return day.format('L')
}
