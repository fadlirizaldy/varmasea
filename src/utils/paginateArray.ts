export const paginateArray = (
  arr: any[],
  pageInfo: {
    currentPage: number;
    numOfItemPerPage: number;
    maxItems: number;
  }
) => {
  return arr.slice(
    (pageInfo.currentPage - 1) * pageInfo.numOfItemPerPage,
    pageInfo.currentPage * pageInfo.numOfItemPerPage < pageInfo.maxItems
      ? pageInfo.currentPage * pageInfo.numOfItemPerPage
      : undefined
  );
};
