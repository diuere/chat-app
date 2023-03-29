export function getNameInitials(name) {
  const splitName = name.toUpperCase().split(' ');
  if (splitName.length > 1) return splitName[0][0] + splitName[1][0];

  return splitName[0][0];
}

export function transformToArrayWithId(snapVal) {
  return Object.keys(snapVal).map(key => {
    return { ...snapVal[key], id: key };
  });
}
