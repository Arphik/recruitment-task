
export function sortResults(sortKey, isAscending, array) {
    return [...array].sort((a, b) =>
      a[sortKey] === b[sortKey]
        ? 0
        : a[sortKey] > b[sortKey]
        ? isAscending
          ? 1
          : -1
        : isAscending
        ? -1
        : 1
    );
  }