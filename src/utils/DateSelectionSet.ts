import RGBAColor from "./RGBAColor";
import DateSelection from "./DateSelection";

export default class DateSelectionSet {
    index: number;
    dates: DateSelection[];
    times: any; // update when the time picker is in the works
    color: RGBAColor;

    constructor(
        index = 0,
        dates = [],
        times = [],
        color = new RGBAColor({})
    ) {
        this.index = index;
        this.dates = dates;
        this.times = times;
        this.color = color;
    }
}