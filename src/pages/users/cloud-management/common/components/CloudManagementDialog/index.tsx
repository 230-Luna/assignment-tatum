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
} from "@/pages/users/cloud-management/common/models/cloudTypes";
import { getSchemaByProvider } from "@/pages/users/cloud-management/common/schemas/validationSchemas";
import { CloudNameField } from "./fields/CloudNameField";
import { SelectProviderField } from "./fields/SelectProviderField";
import { RegionField } from "./fields/RegionField";
import { CloudGroupField } from "./fields/CloudGroupField";
import { ProxyUrlField } from "./fields/ProxyUrlField";
import { ScheduleScanSettingField } from "./fields/ScheduleScanSettingField";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { AWSFormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { AzureFormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { GCPFormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { EventProcessEnabledField } from "./fields/EventProcessEnabledField";
import { UserActivityEnabledField } from "./fields/UserActivityEnabled";
import { ScheduleScanEnabledField } from "./fields/ScheduleScanEnabledField";

// 프로바이더별 기본값 생성 함수
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

  const { handleSubmit, reset, clearErrors, setError } = form;

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
    console.log("form.getValues()", form.getValues());
    handleSubmit(onSubmit)();
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
        <FormProvider {...form}>
          <div className="space-y-6">
            <CloudNameField />
            <SelectProviderField />
            <CloudGroupField />
            <EventProcessEnabledField />
            <UserActivityEnabledField />
            <ScheduleScanEnabledField />
            {form.watch("scheduleScanEnabled") === true ? (
              <ScheduleScanSettingField />
            ) : null}
            {/* <RegionField />
            <ProxyUrlField /> */}
            {/* <ScanFrequencyField /> */}
            {/* <EventIntegrationField /> */}
          </div>
        </FormProvider>

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
