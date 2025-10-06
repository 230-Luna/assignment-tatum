import {
  AWSCredential,
  AWSCredentialType,
  AWSEventSource,
  AzureCredential,
  AzureCredentialType,
  AzureEventSource,
  GCPCredential,
  GCPCredentialType,
  GCPEventSource,
  ScheduleScanSetting,
} from "./cloudTypes";

export type AWSFormType = {
  provider: "AWS";
  name: string;
  cloudGroupName?: string[];
  eventProcessEnabled: boolean;
  userActivityEnabled: boolean;
  scheduleScanEnabled: boolean;
  scheduleScanSetting?: ScheduleScanSetting;
  regionList: string[];
  proxyUrl?: string;
  credentials: AWSCredential;
  credentialType: AWSCredentialType;
  eventSource?: AWSEventSource;
};

export type AzureFormType = {
  provider: "AZURE";
  name: string;
  cloudGroupName?: string[];
  eventProcessEnabled: boolean;
  userActivityEnabled: boolean;
  scheduleScanEnabled: boolean;
  scheduleScanSetting?: ScheduleScanSetting;
  regionList: string[];
  proxyUrl?: string;
  credentials: AzureCredential;
  credentialType: AzureCredentialType;
  eventSource?: AzureEventSource;
};

export type GCPFormType = {
  provider: "GCP";
  name: string;
  cloudGroupName?: string[];
  eventProcessEnabled: boolean;
  userActivityEnabled: boolean;
  scheduleScanEnabled: boolean;
  scheduleScanSetting?: ScheduleScanSetting;
  regionList: string[];
  proxyUrl?: string;
  credentials: GCPCredential;
  credentialType: GCPCredentialType;
  eventSource?: GCPEventSource;
};

export type FormType = AWSFormType | AzureFormType | GCPFormType;
