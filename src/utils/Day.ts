import RGBAColor from './RGBAColor';

export default class Day {
  date: Date;
  isSelected: boolean;
  isEnabled: boolean;
  isHovered: boolean;
  isCurrentMonth: boolean;
  color: RGBAColor | null; // might not be neccessary
  hoverColor: RGBAColor | null; // might not be neccessary

  constructor(
    date: Date,
    isEnabled: boolean = true,
    isSelected: boolean = false,
    isHovered: boolean = false,
    isCurrentMonth = true,
    color: RGBAColor | null = null,
    hoverColor: RGBAColor | null = null,
  ) {
    this.date = date;
    this.isSelected = isSelected;
    this.isEnabled = isEnabled;
    this.isHovered = isHovered;
    this.isCurrentMonth = isCurrentMonth;
    this.color = color;
    this.hoverColor = hoverColor;
  }

  copy({
    isEnabled,
    isSelected,
    isHovered,
    isCurrentMonth,
    color,
    hoverColor,
  }: {
    isEnabled?: boolean;
    isSelected?: boolean;
    isHovered?: boolean;
    isCurrentMonth?: boolean;
    color?: RGBAColor | null;
    hoverColor?: RGBAColor | null;
  }): Day {
    return new Day(
      this.date,
      isEnabled ?? this.isEnabled,
      isSelected ?? this.isSelected,
      isHovered ?? this.isHovered,
      isCurrentMonth ?? this.isCurrentMonth,
      color === undefined ? this.color : color,
      hoverColor === undefined ? this.hoverColor : hoverColor,
    );
  }
}
