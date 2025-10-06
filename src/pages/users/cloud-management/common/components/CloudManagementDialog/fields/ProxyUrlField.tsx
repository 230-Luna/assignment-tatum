import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "../index";

export function ProxyUrlField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">Proxy URL</Label>
      </div>
      <Controller
        name="proxyUrl"
        control={control}
        render={({ field }) => (
          <div>
            <Input
              placeholder="Please enter the proxy URL."
              {...field}
              className={`w-full ${errors.proxyUrl ? "border-red-500" : ""}`}
            />
            {errors.proxyUrl && (
              <p className="text-sm text-red-500 mt-1">
                {errors.proxyUrl.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}
