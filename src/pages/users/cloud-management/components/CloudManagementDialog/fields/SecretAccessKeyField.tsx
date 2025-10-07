import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function SecretAccessKeyField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <div className="space-y-2">
      <Label htmlFor="secretAccessKey" required>
        Secret Access Key
      </Label>
      <Controller
        name="credentials.secretAccessKey"
        control={control}
        rules={{
          required: "Secret Access Key is required.",
        }}
        render={({ field }) => (
          <div>
            <Input
              id="secretAccessKey"
              placeholder="Please enter the secret access key."
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
