import { z } from "zod";

// Cloud Name 유효성 검사
// required
const cloudNameSchema = z.string().min(1, "Cloud Name is required.");

// Access Key 유효성 검사
// required
// `AKIA`: IAM 사용자가 발급한 장기 액세스 키의 접두사
// `AK`:  AWS 계정의 루트 사용자에게 발급된 액세스 키의 접두사
// `ASIA`, `AKID`: IAM 사용자가 발급한 장기 액세스 키의 접두사
const accessKeySchema = z.string().min(1, "Access Key is required.");

// Secret Key 유효성 검사
// required
const secretKeySchema = z.string().min(1, "Secret Key is required.");

// Proxy URL 유효성 검사
// - url 형식
const proxyUrlSchema = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value || value.trim() === "") return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "올바른 URL 형식이 아닙니다.",
    }
  );

// CloudTrail Name 유효성 검사
const cloudTrailNameSchema = z.string().optional();

// AWS Credentials 스키마
const awsCredentialsSchema = z.object({
  accessKeyId: accessKeySchema,
  secretAccessKey: secretKeySchema,
  roleArn: z.string().optional(),
});

// Azure Credentials 스키마 (기본적인 검증만 적용)
const azureCredentialsSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required."),
  subscriptionId: z.string().min(1, "Subscription ID is required."),
  applicationId: z.string().min(1, "Application ID is required."),
  secretKey: z.string().min(1, "Secret Key is required."),
});

// GCP Credentials 스키마 (기본적인 검증만 적용)
const gcpCredentialsSchema = z.object({
  jsonText: z.string().min(1, "JSON 텍스트 is required."),
  projectId: z.string().optional(),
});

// Schedule Scan Setting 스키마
const scheduleScanSettingSchema = z.object({
  frequency: z.enum(["HOUR", "DAY", "WEEK", "MONTH"]),
  date: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // optional이므로 빈 값은 허용
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 1 && num <= 28;
      },
      {
        message: "1부터 28 사이의 숫자를 입력해주세요.",
      }
    ),
  weekday: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]).optional(),
  hour: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // optional이므로 빈 값은 허용
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0 && num <= 23;
      },
      {
        message: "0부터 23 사이의 숫자를 입력해주세요.",
      }
    ),
  minute: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // optional이므로 빈 값은 허용
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0 && num <= 60;
      },
      {
        message: "0부터 60 사이의 숫자를 입력해주세요.",
      }
    ),
});

// 기본 폼 스키마
const baseFormSchema = z.object({
  name: cloudNameSchema,
  cloudGroupName: z.array(z.string()).optional(),
  eventProcessEnabled: z.boolean(),
  userActivityEnabled: z.boolean(),
  scheduleScanEnabled: z.boolean(),
  scheduleScanSetting: scheduleScanSettingSchema.optional(),
  regionList: z.array(z.string()).optional(),
  proxyUrl: proxyUrlSchema,
});

// AWS 폼 스키마
export const awsFormSchema = baseFormSchema.extend({
  provider: z.literal("AWS"),
  credentialType: z.enum(["ACCESS_KEY", "ASSUME_ROLE", "ROLES_ANYWHERE"]),
  credentials: awsCredentialsSchema,
  eventSource: z
    .object({
      cloudTrailName: cloudTrailNameSchema,
    })
    .optional(),
});

// Azure 폼 스키마
export const azureFormSchema = baseFormSchema.extend({
  provider: z.literal("AZURE"),
  credentialType: z.enum(["APPLICATION"]),
  credentials: azureCredentialsSchema,
  eventSource: z
    .object({
      storageAccountName: z.string().optional(),
    })
    .optional(),
});

// GCP 폼 스키마
export const gcpFormSchema = baseFormSchema.extend({
  provider: z.literal("GCP"),
  credentialType: z.enum(["JSON_TEXT"]),
  credentials: gcpCredentialsSchema,
  eventSource: z
    .object({
      auditLogName: z.string().optional(),
    })
    .optional(),
});

export type AWSFormData = z.infer<typeof awsFormSchema>;
export type AzureFormData = z.infer<typeof azureFormSchema>;
export type GCPFormData = z.infer<typeof gcpFormSchema>;

// 프로바이더별 스키마 선택 함수
export const getSchemaByProvider = (provider: string) => {
  switch (provider) {
    case "AWS":
      return awsFormSchema;
    case "AZURE":
      return azureFormSchema;
    case "GCP":
      return gcpFormSchema;
    default:
      return awsFormSchema;
  }
};
