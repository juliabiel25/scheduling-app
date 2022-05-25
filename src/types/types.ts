import DateSelection from "../utils/DateSelection";
import RGBAColor from "../utils/RGBAColor"

export type selectionSetProp = {
    getColor: (index?: number) => RGBAColor | undefined;                  /* get the color of any selection set - by default the currently focused selection set */
    getIndex: () => number;                                     /* get the index of the currently focused selection set */
    addSelection: (selection: DateSelection) => void;         /* add a selection to the currently focused selection */
    switch: (from: number, to: number, date: Date) => void;   /* switch selection sets of a day*/
};