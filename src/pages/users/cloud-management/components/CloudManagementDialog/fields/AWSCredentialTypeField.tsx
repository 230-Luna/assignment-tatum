import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AWSFormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { AWSCredentialType } from "@/pages/users/cloud-management/models/cloudTypes";

export function AWSCredentialTypeField() {
  const { control, watch } = useFormContext<AWSFormType>();
  const watchedProvider = watch("provider");

  if (watchedProvider !== "AWS") {
    throw new Error("AWSCredentialTypeField is only available for AWS");
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="credentialType" required>
        Credential Type
      </Label>
      <Controller
        name="credentialType"
        control={control}
        rules={{
          required: "Credential Type은 필수입니다.",
        }}
        render={({ field }) => (
          <Select
            value={field.value as AWSCredentialType}
            onValueChange={(value: AWSCredentialType) => {
              field.onChange(value);
            }}
          >
            <SelectTrigger className="w-full" id="credentialType">
              <SelectValue placeholder="Select credential type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACCESS_KEY">Access Key</SelectItem>
              <SelectItem value="ASSUME_ROLE" disabled={true}>
                Assume Role
              </SelectItem>
              <SelectItem value="ROLES_ANYWHERE" disabled={true}>
                Roles Anywhere
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
