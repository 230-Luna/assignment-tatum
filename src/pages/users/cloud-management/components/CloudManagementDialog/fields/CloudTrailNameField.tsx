import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AWSFormType } from "@/pages/users/cloud-management/models/ProviderFormType";

export function CloudTrailNameField() {
  const { control, watch } = useFormContext<AWSFormType>();
  const watchedProvider = watch("provider");

  if (watchedProvider !== "AWS") {
    throw new Error("CloudTrailNameField is only available for AWS");
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="cloudTrailName">Cloud Trail Name</Label>
      <Controller
        name="eventSource.cloudTrailName"
        control={control}
        render={({ field }) => (
          <Input
            id="cloudTrailName"
            placeholder="Please enter the CloudTrail name."
            {...field}
          />
        )}
      />
    </div>
  );
}
