import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormType } from "@/pages/users/cloud-management/models/ProviderFormType";

export function EventProcessEnabledField() {
  const { control } = useFormContext<FormType>();

  return (
    <div className="flex content-center  gap-4">
      <Label htmlFor="eventProcessEnabled">Event Process Enabled</Label>
      <Controller
        name="eventProcessEnabled"
        control={control}
        render={({ field }) => (
          <Switch
            id="eventProcessEnabled"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(checked)}
          />
        )}
      />
    </div>
  );
}
