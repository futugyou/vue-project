import moment from 'moment'

const timeCheck = (input: moment.MomentInput): [moment.Moment | null, boolean] => {
    const day = moment(input)
    if (!day.isValid()) {
        return [null, false]
    }
    if (day.year() === 1 && day.month() === 0 && day.date() === 1) {
        return [null, false]
    }
    return [day, true]
}

export const timeFormat = (input: moment.MomentInput): string => {
    const [day, ok] = timeCheck(input)
    if (!ok) {
        return "-"
    }

    return day!.format('lll')
}

export const shortTimeFormat = (input: moment.MomentInput): string => {
    const [day, ok] = timeCheck(input)
    if (!ok) {
        return "-"
    }

    return day!.format('L')
}
