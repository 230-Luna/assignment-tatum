import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";

export function UserActivityEnabledField() {
  const { control } = useFormContext<FormType>();

  return (
    <div className="flex content-center  gap-4">
      <Label htmlFor="userActivityEnabled">User Activity Enabled</Label>
      <Controller
        name="userActivityEnabled"
        control={control}
        render={({ field }) => (
          <div>
            <Switch
              id="userActivityEnabled"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
            />
          </div>
        )}
      />
    </div>
  );
}
