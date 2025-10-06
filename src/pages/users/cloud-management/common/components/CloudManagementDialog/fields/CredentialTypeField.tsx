import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AWSCredential,
  AzureCredential,
  GCPCredential,
} from "@/pages/users/cloud-management/common/models/cloudTypes";
import { getProviderConfig } from "@/pages/users/cloud-management/common/utils/providerUtils";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";

export function CredentialTypeField() {
  const { control, watch, setValue } = useFormContext<FormType>();

  const watchedProvider = watch("provider");
  const providerConfig = getProviderConfig(watchedProvider);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        Select Key Registration Method
      </Label>
      <Controller
        name="credentialType"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              // credentialType 변경 시 credentials 초기화
              const emptyCredentials = (() => {
                switch (watchedProvider) {
                  case "AWS":
                    return {} as AWSCredential;
                  case "AZURE":
                    return {} as AzureCredential;
                  case "GCP":
                    return {} as GCPCredential;
                  default:
                    return {} as AWSCredential;
                }
              })();

              setValue("credentials", emptyCredentials);
              field.onChange(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {providerConfig.credentialTypes.map((type) => (
                <SelectItem
                  key={type.value}
                  value={type.value}
                  disabled={type.value !== "ACCESS_KEY"}
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
