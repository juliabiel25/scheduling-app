import RGBAColor from "./RGBAColor";

export default class SelectionSet {
    constructor({
        index = 0,
        dates = [],
        times = [],
        color = new RGBAColor({})
    }) {
        this.index = index;
        this.dates = dates;
        this.times = times;
        this.color = color;
    }
}