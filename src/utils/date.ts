import moment from "moment";

export const getStringOfDateByMilliseconds = (milliseconds: number) => {
    return moment(milliseconds).format('YYYY/MM/DD');
}