import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function RoleArnField() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<FormType>();

  const provider = watch("provider");

  if (provider !== "AWS") {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="roleArn">Role ARN</Label>
        <span className="text-xs text-gray-500">(Optional)</span>
      </div>
      <Controller
        name="credentials.roleArn"
        control={control}
        render={({ field }) => (
          <div>
            <Input
              id="roleArn"
              placeholder="Please enter the role ARN (optional)."
              {...field}
              hasError={!!errors?.credentials}
            />
            {errors?.credentials &&
            typeof errors.credentials === "object" &&
            "message" in errors.credentials ? (
              <ErrorMessage>{errors.credentials.message}</ErrorMessage>
            ) : null}
          </div>
        )}
      />
    </div>
  );
}
