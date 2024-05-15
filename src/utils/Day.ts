import RGBAColor from './RGBAColor';

export default class Day {
  date: Date;
  isSelected: boolean;
  isEnabled: boolean;
  isHovered: boolean;
  isCurrentMonth: boolean;
  selectionSetIndex: number | null;
  color: RGBAColor | null; // might not be neccessary
  hoverColor: RGBAColor | null; // might not be neccessary

  constructor(
    date: Date,
    isEnabled: boolean = true,
    isSelected: boolean = false,
    isHovered: boolean = false,
    isCurrentMonth = true,
    selectionSetIndex: number | null = null,
    color: RGBAColor | null = null,
    hoverColor: RGBAColor | null = null,
  ) {
    this.date = date;
    this.isSelected = isSelected;
    this.isEnabled = isEnabled;
    this.isHovered = isHovered;
    this.isCurrentMonth = isCurrentMonth;
    this.selectionSetIndex = selectionSetIndex;
    this.color = color;
    this.hoverColor = hoverColor;
  }
}
