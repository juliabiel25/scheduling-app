export const range = (start, end) => (
  Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx)
)

export const allEqual = arr => (
  arr.every(val => val === arr[0])
)
  