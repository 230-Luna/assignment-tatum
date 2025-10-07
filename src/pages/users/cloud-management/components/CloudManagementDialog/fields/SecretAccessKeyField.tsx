import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AWSFormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function SecretAccessKeyField() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<AWSFormType>();

  const watchedProvider = watch("provider");

  if (watchedProvider !== "AWS") {
    throw new Error("SecretAccessKeyField is only available for AWS");
  }

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
          <>
            <Input
              id="secretAccessKey"
              placeholder="Please enter the secret access key."
              {...field}
              hasError={errors?.credentials?.secretAccessKey != null}
            />
            {errors?.credentials?.secretAccessKey != null ? (
              <ErrorMessage>
                {errors.credentials.secretAccessKey.message}
              </ErrorMessage>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
