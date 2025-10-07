import { queryOptions } from "@tanstack/react-query";
import { fetchAllClouds } from "../apis/cloud";

export const fetchAllCloudsQueryOptions = () =>
  queryOptions({
    queryKey: ["fetchAllClouds"],
    queryFn: fetchAllClouds,
  });
