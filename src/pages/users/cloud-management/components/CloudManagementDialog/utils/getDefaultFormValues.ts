import {
  AWSCredential,
  AzureCredential,
  GCPCredential,
  Provider,
} from "@/pages/users/cloud-management/models/cloudTypes";
import {
  AWSFormType,
  AzureFormType,
  FormType,
  GCPFormType,
} from "@/pages/users/cloud-management/models/ProviderFormType";

export const getDefaultFormValues = (provider: Provider): FormType => {
  const baseValues = {
    name: "",
    cloudGroupName: [],
    regionList: ["global"],
    proxyUrl: "",
    eventProcessEnabled: false,
    userActivityEnabled: false,
    scheduleScanEnabled: false,
    scheduleScanSetting: {
      frequency: "HOUR" as const,
      hour: "0",
      minute: "0",
    },
    eventSource: undefined,
  };

  switch (provider) {
    case "AWS":
      return {
        ...baseValues,
        provider: "AWS",
        credentialType: "ACCESS_KEY",
        credentials: {} as AWSCredential,
      } as AWSFormType;

    case "AZURE":
      return {
        ...baseValues,
        provider: "AZURE",
        credentialType: "APPLICATION",
        credentials: {} as AzureCredential,
      } as AzureFormType;

    case "GCP":
      return {
        ...baseValues,
        provider: "GCP",
        credentialType: "JSON_TEXT",
        credentials: {} as GCPCredential,
      } as GCPFormType;

    default:
      return {
        ...baseValues,
        provider: "AWS",
        credentialType: "ACCESS_KEY",
        credentials: {} as AWSCredential,
      } as AWSFormType;
  }
};
