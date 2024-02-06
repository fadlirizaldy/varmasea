import { NextRouter } from "next/router";

export const getIdFromPath = (router: NextRouter) => {
  if (router.isReady) {
    const id = router.asPath.split("?")[0].split("/")[
      router.asPath.split("/").length - 1
    ];
    return Number(id) === 0 ? 1 : id;
  }
  return null;
};
