import { useFetch } from "@/hooks/useFetch";
import { baseUrl } from "@/utils/baseUrl";
import useAuth from "../useAuth";
import { IPageInfo } from "@/types/api";

function useCRUD<T>(ENDPOINT: string) {
  const { token } = useAuth();

  interface IGetData {
    data: {
      admin: T;
      doctor: T;
      user: T;
      product: T;
      order: T;
      stock_mutation: T;
      pharmacy: T;
      category: T;
      province: T;
      cart: T;
      address: T;
      checkout: T;
    };
    message: string;
  }

  interface IGetDatas {
    data: IDatas;
    message: string;
  }

  interface IDatas {
    current_pages?: number;
    total_items?: number;
    total_pages?: number;

    admins: T[];
    doctors: T[];
    users: T[];
    products: T[];
    orders: T[];
    stock_mutations: T[];
    pharmacies: T[];
    categories: T[];
    drug_forms: T[];
    manufactures: T[];
    provinces: T[];
    carts: T[];
    addresses: T[];
    specializations: T[];
  }

  const {
    data,
    isLoading: isGetData,
    error: errorGetData,
    fetchData: fetchData,
  } = useFetch<IGetData>();

  const {
    data: datas,
    isLoading: isGetDatas,
    error: errorGetDatas,
    fetchData: fetchDatas,
  } = useFetch<IGetDatas>();

  const {
    data: dataUpdate,
    isLoading: isDataUpdate,
    error: errorDataUpdate,
    fetchData: fetchDataUpdate,
  } = useFetch<IGetData>();

  const getData = (dataId?: number) => {
    if (dataId === 0) {
      return;
    }
    const url = `${baseUrl(ENDPOINT)}${
      dataId !== undefined ? `/${dataId}` : ""
    }`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetchData(url, options);
  };

  const getDatas = (extraEndpoint?: string, query?: Object) => {
    let queryParams;
    if (query !== undefined) {
      queryParams = Object.keys(query)
        .map((key) => {
          const val = query[key as keyof typeof query];
          return val !== undefined ? `${key}=${val}&` : "";
        })
        .join("");
    }

    const url = `${baseUrl(ENDPOINT)}${
      extraEndpoint ? `/${extraEndpoint}` : ""
    }${query ? `?${queryParams}` : ""}`;
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetchDatas(url, options);
  };

  const updateData = (
    type: "ADD" | "EDIT" | "DELETE",
    body?: Partial<T> | FormData,
    itemId?: number,
    extraEndpointADD?: string
  ) => {
    let url = `${baseUrl(ENDPOINT)}`;

    let options: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const isBodyFormData = body instanceof FormData;
    if (isBodyFormData) {
      options["headers"] = {
        Authorization: `Bearer ${token}`,
      };
    }

    switch (type) {
      case "ADD":
        url = `${baseUrl(ENDPOINT)}${
          extraEndpointADD !== undefined ? `${extraEndpointADD}` : ""
        }`;
        options["method"] = "POST";
        options["body"] = isBodyFormData ? body : JSON.stringify(body);
        break;
      case "DELETE":
        url = `${url}${itemId !== undefined ? `/${itemId}` : ""}`;
        options["method"] = "DELETE";
        options["body"] = body !== undefined ? JSON.stringify(body) : undefined;
        break;
      case "EDIT":
        url = `${url}${itemId !== undefined ? `/${itemId}` : ""}`;
        options["method"] = "PUT";
        options["body"] = isBodyFormData ? body : JSON.stringify(body);
        break;
    }
    fetchDataUpdate(url, options);
  };
  return {
    data: data !== null && data.data !== undefined ? data.data : null,
    datas: datas !== null && datas.data !== undefined ? datas.data : null,
    getDatasMessage:
      datas !== null && datas.message !== undefined ? datas.message : null,
    dataUpdate:
      dataUpdate !== null && dataUpdate !== undefined ? dataUpdate : null,
    pageInfo:
      datas !== null && datas.data !== undefined
        ? ({
            pageNum:
              datas.data.current_pages !== undefined
                ? datas.data.current_pages
                : 1,
            maxPageNum:
              datas.data.total_pages !== undefined ? datas.data.total_pages : 1,
            maxItem:
              datas.data.total_items !== undefined ? datas.data.total_items : 1,
          } as IPageInfo)
        : null,
    isLoading: isGetData || isGetDatas || isDataUpdate,
    error: errorGetData || errorGetDatas || errorDataUpdate,
    getData,
    getDatas,
    updateData,
  };
}

export default useCRUD;
