import {
  Cloud,
  AWSCredential,
  AWSEventSource,
} from "@/pages/users/cloud-management/models/cloudTypes";

// Mock 클라우드 데이터
export const mockCloudData: Cloud[] = [
  {
    id: "cloud-1",
    provider: "AWS",
    name: "Dev",
    cloudGroupName: ["AWS-Group", "Testing"],
    eventProcessEnabled: true,
    userActivityEnabled: true,
    scheduleScanEnabled: true,
    scheduleScanSetting: {
      frequency: "DAY",
      hour: "12",
      minute: "0",
    },
    regionList: ["global", "ap-northeast-2", "us-east-1"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********18",
      secretAccessKey: "jZd1********0n",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
  {
    id: "cloud-2",
    provider: "AWS",
    name: "AWS Ops",
    cloudGroupName: ["AWS-Group"],
    eventProcessEnabled: true,
    userActivityEnabled: false,
    scheduleScanEnabled: true,
    scheduleScanSetting: {
      frequency: "DAY",
      hour: "12",
      minute: "0",
    },
    regionList: ["global", "ap-northeast-1", "eu-west-1"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********42",
      secretAccessKey: "xYz9********3m",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
  {
    id: "cloud-3",
    provider: "AWS",
    name: "Azure Dev",
    cloudGroupName: ["AZURE-Group", "Development"],
    eventProcessEnabled: true,
    userActivityEnabled: true,
    scheduleScanEnabled: true,
    scheduleScanSetting: {
      frequency: "WEEK",
      weekday: "MON",
      hour: "12",
      minute: "0",
    },
    regionList: ["global", "ap-northeast-2"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********67",
      secretAccessKey: "aB3c********8x",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
  {
    id: "cloud-4",
    provider: "AWS",
    name: "AWS Stage",
    cloudGroupName: ["AWS-Group", "Default"],
    eventProcessEnabled: true,
    userActivityEnabled: true,
    scheduleScanEnabled: true,
    scheduleScanSetting: {
      frequency: "DAY",
      hour: "12",
      minute: "0",
    },
    regionList: ["global", "us-west-2", "eu-central-1"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********91",
      secretAccessKey: "mN7p********5q",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
  {
    id: "cloud-5",
    provider: "AWS",
    name: "GCP CX",
    cloudGroupName: ["GCP-Group"],
    eventProcessEnabled: false,
    userActivityEnabled: false,
    scheduleScanEnabled: false,
    regionList: ["global", "ap-southeast-1"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********25",
      secretAccessKey: "rS4t********7u",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
  {
    id: "cloud-6",
    provider: "AWS",
    name: "GCP Research",
    cloudGroupName: ["GCP-Group", "Development"],
    eventProcessEnabled: false,
    userActivityEnabled: false,
    scheduleScanEnabled: false,
    regionList: ["global", "ca-central-1"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********83",
      secretAccessKey: "vW2x********9y",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
  {
    id: "cloud-7",
    provider: "AWS",
    name: "GCP DEV",
    cloudGroupName: ["GCP-Group", "Development"],
    eventProcessEnabled: true,
    userActivityEnabled: true,
    scheduleScanEnabled: true,
    scheduleScanSetting: {
      frequency: "DAY",
      hour: "12",
      minute: "0",
    },
    regionList: ["global", "ap-northeast-3", "sa-east-1"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********46",
      secretAccessKey: "zA1b********2c",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
  {
    id: "cloud-8",
    provider: "AWS",
    name: "prod",
    cloudGroupName: ["AWS-Group", "Default"],
    eventProcessEnabled: true,
    userActivityEnabled: false,
    scheduleScanEnabled: true,
    scheduleScanSetting: {
      frequency: "DAY",
      hour: "12",
      minute: "0",
    },
    regionList: ["global", "us-east-2", "eu-west-2", "ap-south-1"],
    proxyUrl: "",
    credentials: {
      accessKeyId: "AKIA********74",
      secretAccessKey: "dE5f********6g",
    } as AWSCredential,
    credentialType: "ACCESS_KEY",
    eventSource: {
      cloudTrailName: "",
    } as AWSEventSource,
  },
];

// 500ms 지연 후 클라우드 데이터를 반환하는 비동기 함수
export const fetchCloudById = async (id: string): Promise<Cloud | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const cloud = mockCloudData.find((cloud) => cloud.id === id);
  return cloud || null;
};

// 500ms 지연 후 모든 클라우드 데이터를 반환하는 비동기 함수
export const fetchAllClouds = async (): Promise<Cloud[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockCloudData;
};
