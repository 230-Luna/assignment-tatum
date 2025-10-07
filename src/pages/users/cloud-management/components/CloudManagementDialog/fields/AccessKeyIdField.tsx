import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function AccessKeyIdField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <div className="space-y-2">
      <Label htmlFor="accessKeyId" required>
        Access Key ID
      </Label>
      <Controller
        name="credentials.accessKeyId"
        control={control}
        rules={{
          required: "Access Key ID is required.",
        }}
        render={({ field }) => (
          <div>
            <Input
              id="accessKeyId"
              placeholder="Please enter the access key ID."
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
