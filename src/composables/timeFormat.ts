import moment from 'moment'

export const useTimeFormat = (input: moment.MomentInput): string => {
    var day = moment(input)
    return day.format('lll')
}
