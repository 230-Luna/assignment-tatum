import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function CloudTrailNameField() {
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
        <Label htmlFor="cloudTrailName">Cloud Trail Name</Label>
      </div>
      <Controller
        name="eventSource.cloudTrailName"
        control={control}
        render={({ field }) => (
          <div>
            <Input
              id="cloudTrailName"
              placeholder="Please enter the CloudTrail name."
              {...field}
              hasError={!!errors?.eventSource}
            />
            {errors?.eventSource &&
            typeof errors.eventSource === "object" &&
            "message" in errors.eventSource ? (
              <ErrorMessage>{errors.eventSource.message}</ErrorMessage>
            ) : null}
          </div>
        )}
      />
    </div>
  );
}
