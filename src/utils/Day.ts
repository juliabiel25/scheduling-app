import RGBAColor from './RGBAColor';
export default class Day {
  date: Date;
  isSelected: boolean;
  isEnabled: boolean;
  isHovered: boolean;
  isCurrentMonth: boolean;
  selectionSetIndex: number | null;
  color: RGBAColor | null;  // might not be neccessary 

  constructor(
    date: Date,
    isSelected = false,
    isEnabled = true,
    isHovered = false,
    isCurrentMonth = true,
    selectionSetIndex = null,
    color = null,
  ) {
    this.date = date;
    this.isSelected = isSelected;
    this.isEnabled = isEnabled;
    this.isHovered = isHovered;
    this.isCurrentMonth = isCurrentMonth;
    this.selectionSetIndex = selectionSetIndex;
    this.color = color;
  }
}
