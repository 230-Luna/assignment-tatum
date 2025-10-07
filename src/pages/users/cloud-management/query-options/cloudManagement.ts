import { fetchAllClouds } from "@/mocks/cloudManagementData";
import { queryOptions } from "@tanstack/react-query";

export const fetchAllCloudsQueryOptions = () =>
  queryOptions({
    queryKey: ["fetchAllClouds"],
    queryFn: fetchAllClouds,
  });
