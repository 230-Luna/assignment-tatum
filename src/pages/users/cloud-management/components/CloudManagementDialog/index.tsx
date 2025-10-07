import { useForm, FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Cloud,
  ScheduleScanFrequency,
  ScheduleScanWeekday,
} from "@/pages/users/cloud-management/models/cloudTypes";
import { getSchemaByProvider } from "@/pages/users/cloud-management/schemas/validationSchemas";
import { CloudNameField } from "./fields/CloudNameField";
import { SelectProviderField } from "./fields/SelectProviderField";
import { RegionField } from "./fields/RegionField";
import { CloudGroupField } from "./fields/CloudGroupField";
import { ProxyUrlField } from "./fields/ProxyUrlField";
import { ScheduleScanSettingField } from "./fields/ScheduleScanSettingField";
import { FormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { EventProcessEnabledField } from "./fields/EventProcessEnabledField";
import { UserActivityEnabledField } from "./fields/UserActivityEnabled";
import { ScheduleScanEnabledField } from "./fields/ScheduleScanEnabledField";
import { AccessKeyIdField } from "./fields/AccessKeyIdField";
import { SecretAccessKeyField } from "./fields/SecretAccessKeyField";
import { AWSCredentialTypeField } from "./fields/AWSCredentialTypeField";
import { CloudTrailNameField } from "./fields/CloudTrailNameField";
import { getDefaultFormValues } from "./utils/getDefaultFormValues";

export function CloudManagementDialog({
  open,
  onClose,
  onComplete,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: ({ data }: { data?: FormType }) => void;
  initialData?: Cloud;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData == null ? "Create" : "Edit"} Cloud
          </DialogTitle>
        </DialogHeader>

        <CloudManagementDialogContent
          key={initialData?.id}
          initialData={initialData}
          onClose={onClose}
          onComplete={onComplete}
        />
      </DialogContent>
    </Dialog>
  );
}

function CloudManagementDialogContent({
  initialData,
  onClose,
  onComplete,
}: {
  initialData?: Cloud;
  onClose: () => void;
  onComplete: ({ data }: { data?: FormType }) => void;
}) {
  const form = useForm<FormType>({
    defaultValues: initialData
      ? (initialData as FormType)
      : getDefaultFormValues("AWS"),
    mode: "onChange",
  });

  const { handleSubmit, clearErrors, setError } = form;

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
    };

    onComplete({ data: payload });
  };

  return (
    <div>
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
        <Button type="button" variant="outline" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
