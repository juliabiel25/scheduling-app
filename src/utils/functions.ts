export const range = (
    start: number, 
    end: number
): number[] => (
  Array(end - start + 1)
    .fill(undefined)
    .map((_, idx) => start + idx)
)
