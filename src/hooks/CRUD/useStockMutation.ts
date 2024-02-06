import { IStockMutationResponse, IStockMutationRequest } from "@/types/api";
import { STOCK_MUTATIONS_ENDPOINT } from "@/utils/api/apiURL";
import useCRUD from "./useCRUD";

function useStockMutation() {
  const {
    data,
    datas,
    pageInfo,
    dataUpdate,
    isLoading,
    error,
    getData,
    getDatas,
    updateData,
  } = useCRUD<IStockMutationResponse>(STOCK_MUTATIONS_ENDPOINT);

  const requestStockMutation = (body: IStockMutationRequest) => {
    updateData("ADD", body);
  };
  const editStockMutation = (
    body: IStockMutationRequest,
    stockMutationId: number
  ) => {
    updateData("EDIT", body, `${stockMutationId}/` as unknown as number);
  };

  const getStockMutation = (dataId: number) => {
    getData(`${dataId}/` as unknown as number);
  };

  return {
    stockMutation: data !== null ? data.stock_mutation : null,
    stockMutations:
      datas !== null && datas.stock_mutations !== null
        ? datas.stock_mutations.length > 0
          ? datas.stock_mutations
          : null
        : null,
    pageInfo,
    stockMutationUpdated: dataUpdate !== null ? dataUpdate : null,
    isLoading,
    error,
    getStockMutation,
    getStockMutations: getDatas,
    requestStockMutation,
    editStockMutation,
  };
}

export default useStockMutation;
