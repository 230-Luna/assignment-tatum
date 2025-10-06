import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Provider } from "@/pages/users/cloud-management/common/models/cloudTypes";
import { SelectValue } from "@/components/ui/select";
import { getDefaultFormValues } from "../index";

export function SelectProviderField() {
  const { control, getValues, reset } = useFormContext();

  return (
    <div className="space-y-2">
      <Label>Select Provider</Label>
      <Controller
        name="provider"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value: Provider) => {
              // 프로바이더 변경 시 해당 프로바이더의 기본값으로 리셋
              const newDefaults = getDefaultFormValues(value);

              // 기본 정보는 유지하고 프로바이더 관련 필드만 리셋
              const currentName = getValues("name");
              const currentCloudGroupName = getValues("cloudGroupName");
              const currentProxyUrl = getValues("proxyUrl");
              const currentEventProcessEnabled = getValues(
                "eventProcessEnabled"
              );
              const currentUserActivityEnabled = getValues(
                "userActivityEnabled"
              );
              const currentScheduleScanEnabled = getValues(
                "scheduleScanEnabled"
              );
              const currentScheduleScanSetting = getValues(
                "scheduleScanSetting"
              );

              reset({
                ...newDefaults,
                name: currentName,
                cloudGroupName: currentCloudGroupName,
                proxyUrl: currentProxyUrl,
                eventProcessEnabled: currentEventProcessEnabled,
                userActivityEnabled: currentUserActivityEnabled,
                scheduleScanEnabled: currentScheduleScanEnabled,
                scheduleScanSetting: currentScheduleScanSetting,
              });

              field.onChange(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AWS">AWS</SelectItem>
              <SelectItem value="AZURE" disabled={false}>
                AZURE
              </SelectItem>
              <SelectItem value="GCP" disabled={false}>
                GCP
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
