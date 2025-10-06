import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import { ErrorMessage } from "../../ErrorMessage";

export function CloudNameField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormType>();

  return (
    <div className="space-y-2">
      <Label htmlFor="cloudName" required>
        Cloud Name
      </Label>
      <Controller
        name="name"
        control={control}
        rules={{
          required: "Cloud Name is required.",
        }}
        render={({ field }) => (
          <div>
            <Input
              id="cloudName"
              placeholder="Please enter the cloud name."
              {...field}
              hasError={!!errors.name}
            />
            {errors.name ? (
              <ErrorMessage>{errors.name.message}</ErrorMessage>
            ) : null}
          </div>
        )}
      />
    </div>
  );
}
