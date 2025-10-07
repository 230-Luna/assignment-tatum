import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AWSFormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function RoleArnField() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<AWSFormType>();
  const watchedProvider = watch("provider");

  if (watchedProvider !== "AWS") {
    throw new Error("RoleArnField is only available for AWS");
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="roleArn">Role ARN</Label>
      <span className="text-xs text-gray-500">(Optional)</span>
      <Controller
        name="credentials.roleArn"
        control={control}
        render={({ field }) => (
          <>
            <Input
              id="roleArn"
              placeholder="Please enter the role ARN (optional)."
              {...field}
              hasError={errors?.credentials?.roleArn != null}
            />
            {errors?.credentials?.roleArn != null ? (
              <ErrorMessage>{errors.credentials.message}</ErrorMessage>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
