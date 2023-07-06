import moment from 'moment'

export const useTimeFormat = (timestamp: number): string => {
    var day = moment(timestamp)
    return day.format('lll')
}
