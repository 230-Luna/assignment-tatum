import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { DynamicField } from "@/components/DynamicField";
import { getCredentialFields } from "@/pages/users/cloud-management/common/utils/providerUtils";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";

export function CredentialsField() {
  const [showPasswordFields, setShowPasswordFields] = useState<
    Record<string, boolean>
  >({});

  const {
    watch,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
    setError,
  } = useFormContext<FormType>();

  const watchedProvider = watch("provider");
  const watchedCredentialType = watch("credentialType");
  const watchedCredentials = watch("credentials");

  const credentialFields = getCredentialFields(
    watchedProvider,
    watchedCredentialType
  );

  const handleCredentialFieldChange = (fieldKey: string, value: string) => {
    const currentCredentials = getValues("credentials");
    setValue(
      "credentials",
      {
        ...currentCredentials,
        [fieldKey]: value,
      },
      { shouldValidate: true }
    );

    // 필수 필드 검증
    const fieldConfig = credentialFields.find((f) => f.key === fieldKey);

    if (fieldConfig?.required && !value?.trim()) {
      setError(`credentials.${fieldKey}` as keyof FormType, {
        type: "manual",
        message: `${fieldConfig.label}는 필수입니다.`,
      });
    } else {
      clearErrors(`credentials.${fieldKey}` as keyof FormType);
    }
  };

  const togglePasswordVisibility = (fieldKey: string) => {
    setShowPasswordFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">Credentials</Label>
      </div>

      <div className="space-y-3">
        {credentialFields.map((field) => (
          <DynamicField
            key={field.key}
            config={field}
            value={
              (watchedCredentials as unknown as Record<string, string>)[
                field.key
              ] || ""
            }
            onChange={(value) =>
              handleCredentialFieldChange(field.key, value as string)
            }
            showPassword={showPasswordFields[field.key] || false}
            onTogglePassword={
              field.type === "password"
                ? () => togglePasswordVisibility(field.key)
                : undefined
            }
            error={
              errors.credentials &&
              typeof errors.credentials === "object" &&
              field.key in errors.credentials
                ? (errors.credentials as Record<string, { message?: string }>)[
                    field.key
                  ]?.message
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
