export function sortByInIndex(a, b) {
  if (a.properties.in_index < b.properties.in_index) {
    return -1;
  }
  if (a.properties.in_index > b.properties.in_index) {
    return 1;
  }
  return 0;
}

export function sortByOutIndex(a, b) {
  if (a.properties.out_index < b.properties.out_index) {
    return -1;
  }
  if (a.properties.out_index > b.properties.out_index) {
    return 1;
  }
  return 0;
}