export function getCleanData(obj: any) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.filter((value) => {
      return ![undefined, null, "", [], {}].includes(value);
    });
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = getCleanData(obj[key]);
    if (
      value !== undefined &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0) &&
      !(typeof value === "object" && Object.keys(value).length === 0) &&
      !(typeof value === "string" && value.trim() === "")
    ) {
      acc[key as keyof Object] = value;
    }
    return acc;
  }, {});
}
