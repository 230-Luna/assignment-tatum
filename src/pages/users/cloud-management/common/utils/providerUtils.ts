import { Provider } from "../models/cloudTypes";
import {
  FieldConfig,
  PROVIDER_CONFIGS,
  ProviderConfig,
} from "../models/providerConfigs";

export const getProviderConfig = (provider: Provider): ProviderConfig => {
  return PROVIDER_CONFIGS[provider];
};

export const getCredentialFields = (
  provider: Provider,
  credentialType: string
): FieldConfig[] => {
  const config = getProviderConfig(provider);
  return config.credentialFields[credentialType] || [];
};

export const getEventSourceFields = (provider: Provider): FieldConfig[] => {
  const config = getProviderConfig(provider);
  return config.eventSourceFields;
};

export const getRegionList = (provider: Provider): readonly string[] => {
  const config = getProviderConfig(provider);
  return config.regionList;
};

export const isFeatureSupported = (
  provider: Provider,
  feature: keyof ProviderConfig["supportedFeatures"]
): boolean => {
  const config = getProviderConfig(provider);
  return config.supportedFeatures[feature];
};
