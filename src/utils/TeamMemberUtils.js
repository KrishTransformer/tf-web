export const entityToDropdown = (entity, attributeName) => {
  if (!Array.isArray(entity)) {
    console.warn("Expected an array, but got:", entity);
    return [];
  }

  return entity.map((item) => ({
    value: item[attributeName],
    label: item[attributeName],
  }));
};
