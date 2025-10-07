import { useForm, FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchCloudById } from "@/mocks/cloudManagementData";
import {
  Provider,
  AWSCredential,
  AzureCredential,
  GCPCredential,
  ScheduleScanFrequency,
  ScheduleScanWeekday,
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
import { AccessKeyIdField } from "./fields/AccessKeyIdField";
import { SecretAccessKeyField } from "./fields/SecretAccessKeyField";
import { AWSCredentialTypeField } from "./fields/AWSCredentialTypeField";
import { CloudTrailNameField } from "./fields/CloudTrailNameField";
import { useEffect } from "react";

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
  cloudId,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: ({ data }: { data?: FormType }) => void;
  cloudId?: string;
}) {
  const { data: serverData, isLoading } = useQuery({
    queryKey: ["cloud", cloudId],
    queryFn: () => fetchCloudById(cloudId!),
    enabled: !!cloudId && open,
    staleTime: 0,
    gcTime: 0,
  });

  const form = useForm<FormType>({
    defaultValues: getDefaultFormValues("AWS"),
    mode: "onChange",
  });

  const { handleSubmit, reset, clearErrors, setError } = form;

  useEffect(() => {
    if (cloudId && serverData && open) {
      reset(serverData as FormType);
    } else if (!cloudId && open) {
      reset(getDefaultFormValues("AWS"));
    }
  }, [cloudId, serverData, open, reset]);

  const handleCancel = () => {
    if (serverData) {
      reset(serverData as FormType);
    } else {
      reset(getDefaultFormValues("AWS"));
    }
    onClose();
  };

  const onSubmit = (formData: FormType) => {
    const schema = getSchemaByProvider(formData.provider);
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
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

    clearErrors();

    const payload = {
      ...formData,
      scheduleScanSetting: formData.scheduleScanEnabled
        ? {
            frequency: formData.scheduleScanSetting
              ?.frequency as ScheduleScanFrequency,
            ...(formData.scheduleScanSetting?.frequency === "MONTH" && {
              date: formData.scheduleScanSetting?.date,
            }),
            ...(formData.scheduleScanSetting?.frequency === "WEEK" && {
              weekday: formData.scheduleScanSetting
                ?.weekday as ScheduleScanWeekday,
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

  const handleConfirmClick = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{cloudId ? "Edit" : "Create"} Cloud</DialogTitle>
        </DialogHeader>

        {isLoading && cloudId && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">데이터를 불러오는 중...</span>
          </div>
        )}

        {(!isLoading || !cloudId) && (
          <FormProvider {...form}>
            <div className="space-y-6">
              <CloudNameField />
              <SelectProviderField />
              {form.watch("provider") === "AWS" && (
                <>
                  <AWSCredentialTypeField />
                  {form.watch("credentialType") === "ACCESS_KEY" && (
                    <>
                      <AccessKeyIdField />
                      <SecretAccessKeyField />
                    </>
                  )}
                  <CloudTrailNameField />
                </>
              )}
              <CloudGroupField />
              <EventProcessEnabledField />
              <UserActivityEnabledField />
              <ScheduleScanEnabledField />
              {form.watch("scheduleScanEnabled") === true ? (
                <ScheduleScanSettingField />
              ) : null}
              <RegionField />
              <ProxyUrlField />
            </div>
          </FormProvider>
        )}

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmClick}
            disabled={isLoading && !!cloudId}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
