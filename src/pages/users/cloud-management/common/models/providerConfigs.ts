import {
  Provider,
  AWSRegionList,
  AzureRegionList,
  GCPRegionList,
} from "./cloudTypes";

// 필드 타입 정의
export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "password" | "select" | "multiselect";
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  helpText?: string;
}

// 프로바이더별 설정 인터페이스
export interface ProviderConfig {
  name: string;
  credentialTypes: Array<{ value: string; label: string; disabled?: boolean }>;
  credentialFields: Record<string, FieldConfig[]>;
  eventSourceFields: FieldConfig[];
  regionList: readonly string[];
  supportedFeatures: {
    scheduleScan: boolean;
    eventProcess: boolean;
    userActivity: boolean;
  };
}

// AWS 설정
const AWS_CONFIG: ProviderConfig = {
  name: "AWS",
  credentialTypes: [
    { value: "ACCESS_KEY", label: "Access Key" },
    { value: "ASSUME_ROLE", label: "Assume Role", disabled: true },
    { value: "ROLES_ANYWHERE", label: "Roles Anywhere", disabled: true },
  ],
  credentialFields: {
    ACCESS_KEY: [
      {
        key: "accessKeyId",
        label: "Access Key",
        type: "text",
        required: true,
        placeholder: "Enter AWS access key",
      },
      {
        key: "secretAccessKey",
        label: "Secret Key",
        type: "password",
        required: true,
        placeholder: "Enter AWS secret access key",
      },
    ],
    ASSUME_ROLE: [
      {
        key: "roleArn",
        label: "Role ARN",
        type: "text",
        required: true,
        placeholder: "arn:aws:iam::account:role/role-name",
      },
    ],
    ROLES_ANYWHERE: [
      {
        key: "certificateId",
        label: "Certificate ID",
        type: "text",
        required: true,
      },
      {
        key: "privateKey",
        label: "Private Key",
        type: "password",
        required: true,
      },
    ],
  },
  eventSourceFields: [
    {
      key: "cloudTrailName",
      label: "CloudTrail Name",
      type: "text",
      required: false,
      placeholder: "Please enter the cloud trail name.",
    },
  ],
  regionList: AWSRegionList,
  supportedFeatures: {
    scheduleScan: true,
    eventProcess: true,
    userActivity: true,
  },
};

// Azure 설정
const AZURE_CONFIG: ProviderConfig = {
  name: "AZURE",
  credentialTypes: [{ value: "APPLICATION", label: "Application" }],
  credentialFields: {
    APPLICATION: [
      {
        key: "tenantId",
        label: "Tenant ID",
        type: "text",
        required: true,
        placeholder: "Enter Azure tenant ID",
      },
      {
        key: "subscriptionId",
        label: "Subscription ID",
        type: "text",
        required: true,
        placeholder: "Enter subscription ID",
      },
      {
        key: "applicationId",
        label: "Application ID",
        type: "text",
        required: true,
        placeholder: "Enter application ID",
      },
      {
        key: "secretKey",
        label: "Secret Key",
        type: "password",
        required: true,
        placeholder: "Enter application secret",
      },
    ],
    SERVICE_PRINCIPAL: [
      {
        key: "clientId",
        label: "Client ID",
        type: "text",
        required: true,
      },
      {
        key: "clientSecret",
        label: "Client Secret",
        type: "password",
        required: true,
      },
    ],
  },
  eventSourceFields: [
    {
      key: "storageAccountName",
      label: "Storage Account Name",
      type: "text",
      required: false,
      placeholder: "Enter storage account name",
    },
    {
      key: "containerName",
      label: "Container Name",
      type: "text",
      required: false,
      placeholder: "Enter container name",
    },
  ],
  regionList: AzureRegionList,
  supportedFeatures: {
    scheduleScan: true,
    eventProcess: true,
    userActivity: false, // Azure는 user activity 미지원 예시
  },
};

// GCP 설정
const GCP_CONFIG: ProviderConfig = {
  name: "GCP",
  credentialTypes: [{ value: "JSON_TEXT", label: "JSON Text" }],
  credentialFields: {
    JSON_TEXT: [
      {
        key: "projectId",
        label: "Project ID",
        type: "text",
        required: false,
        placeholder: "Enter GCP project ID (optional)",
      },
      {
        key: "jsonText",
        label: "JSON Key",
        type: "text",
        required: true,
        placeholder: "Paste service account JSON key",
      },
    ],
    SERVICE_ACCOUNT: [
      {
        key: "serviceAccountEmail",
        label: "Service Account Email",
        type: "text",
        required: true,
      },
      {
        key: "keyFile",
        label: "Key File",
        type: "text",
        required: true,
      },
    ],
  },
  eventSourceFields: [
    {
      key: "bucketName",
      label: "Storage Bucket Name",
      type: "text",
      required: false,
      placeholder: "Enter Cloud Storage bucket name",
    },
    {
      key: "logSinkName",
      label: "Log Sink Name",
      type: "text",
      required: false,
      placeholder: "Enter Cloud Logging sink name",
    },
  ],
  regionList: GCPRegionList,
  supportedFeatures: {
    scheduleScan: true,
    eventProcess: false, // GCP는 event process 미지원 예시
    userActivity: false,
  },
};

// 프로바이더별 설정 맵
export const PROVIDER_CONFIGS: Record<Provider, ProviderConfig> = {
  AWS: AWS_CONFIG,
  AZURE: AZURE_CONFIG,
  GCP: GCP_CONFIG,
};
