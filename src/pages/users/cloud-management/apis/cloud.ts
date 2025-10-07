import { mockCloudData } from "@/mocks/cloudManagementData";
import { Cloud } from "../models/cloudTypes";
import { delay } from "@/utils/delay";

// 500ms 지연 후 클라우드 데이터를 반환하는 비동기 함수
export const fetchCloudById = async (id: string): Promise<Cloud | null> => {
  await delay(500);

  const cloud = mockCloudData.find((cloud) => cloud.id === id);
  return cloud || null;
};

// 500ms 지연 후 모든 클라우드 데이터를 반환하는 비동기 함수
export const fetchAllClouds = async (): Promise<Cloud[]> => {
  await delay(500);

  return mockCloudData;
};
