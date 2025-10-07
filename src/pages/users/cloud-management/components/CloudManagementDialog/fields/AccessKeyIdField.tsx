import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AWSFormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function AccessKeyIdField() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<AWSFormType>();

  const watchedProvider = watch("provider");

  if (watchedProvider !== "AWS") {
    throw new Error("AccessKeyIdField is only available for AWS");
  }

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
        render={({ field }) => {
          return (
            <>
              <Input
                id="accessKeyId"
                placeholder="Please enter the access key ID."
                {...field}
                hasError={errors?.credentials?.accessKeyId != null}
              />
              {errors?.credentials?.accessKeyId != null ? (
                <ErrorMessage>
                  {errors.credentials.accessKeyId.message}
                </ErrorMessage>
              ) : null}
            </>
          );
        }}
      />
    </div>
  );
}
