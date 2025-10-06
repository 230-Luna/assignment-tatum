import { useForm, FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Provider,
  AWSCredential,
  AzureCredential,
  GCPCredential,
  AWSCredentialType,
  AzureCredentialType,
  GCPCredentialType,
} from "@/pages/users/cloud-management/common/models/cloudTypes";
import {
  getProviderConfig,
  getCredentialFields,
} from "@/pages/users/cloud-management/common/utils/providerUtils";
import { getSchemaByProvider } from "@/pages/users/cloud-management/common/schemas/validationSchemas";
import { CloudNameField } from "./fields/CloudNameField";
import { SelectProviderField } from "./fields/SelectProviderField";
import { CredentialTypeField } from "./fields/CredentialTypeField";
import { CredentialsField } from "./fields/CredentialsField";
import { RegionField } from "./fields/RegionField";
import { CloudGroupField } from "./fields/CloudGroupField";
import { ProxyUrlField } from "./fields/ProxyUrlField";
import { ScanScheduleField } from "./fields/ScanScheduleField";
import { ScanFrequencyField } from "./fields/ScanFrequencyField";
import { EventIntegrationField } from "./fields/EventIntegrationField";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { AWSFormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { AzureFormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { GCPFormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";

// 프로바이더별 기본값 생성 함수
export const getDefaultFormValues = (provider: Provider): FormType => {
  const providerConfig = getProviderConfig(provider);
  const defaultCredentialType = providerConfig.credentialTypes.find(
    (type) => !type.disabled
  )?.value;

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
        credentialType:
          (defaultCredentialType as AWSCredentialType) || "ACCESS_KEY",
        credentials: {} as AWSCredential,
      } as AWSFormType;

    case "AZURE":
      return {
        ...baseValues,
        provider: "AZURE",
        credentialType:
          (defaultCredentialType as AzureCredentialType) || "APPLICATION",
        credentials: {} as AzureCredential,
      } as AzureFormType;

    case "GCP":
      return {
        ...baseValues,
        provider: "GCP",
        credentialType:
          (defaultCredentialType as GCPCredentialType) || "JSON_TEXT",
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

export function CloudManagementDialog({
  open,
  onClose,
  onComplete,
  data,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: ({ data }: { data?: FormType }) => void;
  data?: FormType;
}) {
  const form = useForm<FormType>({
    defaultValues: data ?? getDefaultFormValues("AWS"),
    mode: "onChange",
  });

  const { handleSubmit, reset, watch, getValues, clearErrors, setError } = form;

  // 폼 데이터 감시
  const watchedProvider = watch("provider");
  const watchedCredentialType = watch("credentialType");
  const watchedCredentials = watch("credentials");

  const handleCancel = () => {
    reset(data);
    onClose();
  };

  const onSubmit = (formData: FormType) => {
    // 수동 Zod 유효성 검사
    const schema = getSchemaByProvider(formData.provider);
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      // 유효성 검사 실패 시 에러를 폼 필드에 설정
      clearErrors();
      validationResult.error.issues.forEach((err) => {
        const path = err.path.join(".");
        setError(path as keyof FormType, {
          type: "manual",
          message: err.message,
        });
      });
      return;
    }

    // 검증 성공 시 에러 클리어
    clearErrors();

    // 서버 전송용 페이로드 생성
    const payload = {
      ...formData,
      scheduleScanSetting: formData.scheduleScanEnabled
        ? {
            frequency: formData.scheduleScanSetting?.frequency as
              | "HOUR"
              | "DAY"
              | "WEEK"
              | "MONTH",
            ...(formData.scheduleScanSetting?.frequency === "MONTH" && {
              date: formData.scheduleScanSetting?.date,
            }),
            ...(formData.scheduleScanSetting?.frequency === "WEEK" && {
              weekday: formData.scheduleScanSetting?.weekday as
                | "MON"
                | "TUE"
                | "WED"
                | "THU"
                | "FRI"
                | "SAT"
                | "SUN",
            }),
            ...(formData.scheduleScanSetting?.frequency !== "HOUR" && {
              hour: formData.scheduleScanSetting?.hour,
            }),
            minute: formData.scheduleScanSetting?.minute,
          }
        : undefined,
    } as FormType;

    onComplete({ data: payload });
    console.log("서버 전송용 페이로드:", payload);
  };

  // 확인 버튼 클릭 핸들러 (disabled 상태에서도 유효성 검사 실행)
  const handleConfirmClick = () => {
    const formData = getValues();

    // 필수 필드 검증 및 에러 설정
    let hasErrors = false;

    // Cloud Name 검증
    if (!formData.name?.trim()) {
      setError("name", {
        type: "manual",
        message: "Cloud Name는 필수입니다.",
      });
      hasErrors = true;
    }

    // Credentials 필수 필드 검증
    const credentialFields = getCredentialFields(
      watchedProvider,
      watchedCredentialType
    );
    const requiredCredentialFields = credentialFields.filter(
      (field) => field.required
    );

    for (const field of requiredCredentialFields) {
      const value = (watchedCredentials as unknown as Record<string, string>)?.[
        field.key
      ];
      if (!value?.trim()) {
        setError(`credentials.${field.key}` as keyof FormType, {
          type: "manual",
          message: `${field.label}는 필수입니다.`,
        });
        hasErrors = true;
      }
    }

    // 에러가 있으면 제출하지 않음
    if (hasErrors) {
      return;
    }

    // 에러가 없으면 정상 제출
    handleSubmit(onSubmit)();
  };

  const renderStep1 = () => {
    return (
      <FormProvider {...form}>
        <div className="space-y-6">
          <CloudNameField />
          <SelectProviderField />
          <CredentialTypeField />
          <CredentialsField />
          <RegionField />
          <CloudGroupField />
          <ProxyUrlField />
        </div>
      </FormProvider>
    );
  };

  const renderStep2 = () => {
    return (
      <FormProvider {...form}>
        <div className="space-y-6">
          <ScanScheduleField />
          <ScanFrequencyField />
          <EventIntegrationField />
        </div>
      </FormProvider>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
            </div>
            {data ? "Edit" : "Create"} Cloud
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* Step 1 - Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            {renderStep1()}
          </div>

          {/* Step 2 - Scan & Event Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Scan & Event Settings
            </h3>
            {renderStep2()}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="button" onClick={handleConfirmClick}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
