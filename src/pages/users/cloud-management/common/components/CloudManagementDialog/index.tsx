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
import { AccessKeyIdField } from "./fields/AccessKeyIdField";
import { SecretAccessKeyField } from "./fields/SecretAccessKeyField";
import { AWSCredentialTypeField } from "./fields/AWSCredentialTypeField";
import { CloudTrailNameField } from "./fields/CloudTrailNameField";

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

  const handleConfirmClick = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data ? "Edit" : "Create"} Cloud</DialogTitle>
        </DialogHeader>
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

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirmClick}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
