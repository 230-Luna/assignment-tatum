import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { isFeatureSupported } from "@/pages/users/cloud-management/common/utils/providerUtils";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";

export function ScanScheduleField() {
  const { control, watch } = useFormContext<FormType>();

  const watchedProvider = watch("provider");
  const supportsScheduleScan = isFeatureSupported(
    watchedProvider,
    "scheduleScan"
  );

  if (!supportsScheduleScan) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Scan Schedule Setting
      </Label>

      <Controller
        name="scheduleScanEnabled"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value ? "enabled" : "disabled"}
            onValueChange={(value: string) =>
              field.onChange(value === "enabled")
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enabled" id="enabled" />
              <Label htmlFor="enabled" className="text-sm">
                Enabled
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disabled" id="disabled" />
              <Label htmlFor="disabled" className="text-sm">
                Disabled
              </Label>
            </div>
          </RadioGroup>
        )}
      />
    </div>
  );
}
