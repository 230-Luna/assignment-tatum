import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function ProxyUrlField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>Proxy URL</Label>
      </div>
      <Controller
        name="proxyUrl"
        control={control}
        render={({ field }) => (
          <div>
            <Input
              placeholder="Please enter the proxy URL."
              {...field}
              hasError={!!errors.proxyUrl}
            />
            {errors.proxyUrl ? (
              <ErrorMessage>{errors.proxyUrl.message}</ErrorMessage>
            ) : null}
          </div>
        )}
      />
    </div>
  );
}
