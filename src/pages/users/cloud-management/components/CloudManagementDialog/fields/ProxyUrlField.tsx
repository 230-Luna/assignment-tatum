import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function ProxyUrlField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <div className="space-y-2">
      <Label>Proxy URL</Label>
      <Controller
        name="proxyUrl"
        control={control}
        render={({ field }) => (
          <>
            <Input placeholder="Please enter the proxy URL." {...field} />
            {errors.proxyUrl != null ? (
              <ErrorMessage>{errors.proxyUrl.message}</ErrorMessage>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
