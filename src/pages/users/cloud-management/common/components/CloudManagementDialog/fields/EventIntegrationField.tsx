import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DynamicField } from "@/components/DynamicField";
import {
  getEventSourceFields,
  isFeatureSupported,
} from "@/pages/users/cloud-management/common/utils/providerUtils";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";

export function EventIntegrationField() {
  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<FormType>();

  const watchedProvider = watch("provider");
  const watchedEventSource = watch("eventSource");

  const eventSourceFields = getEventSourceFields(watchedProvider);
  const supportsEventProcess = isFeatureSupported(
    watchedProvider,
    "eventProcess"
  );
  const supportsUserActivity = isFeatureSupported(
    watchedProvider,
    "userActivity"
  );

  const handleEventSourceFieldChange = (fieldKey: string, value: string) => {
    const currentEventSource = getValues("eventSource");
    setValue("eventSource", {
      ...currentEventSource,
      [fieldKey]: value,
    });
  };

  // 어떤 기능도 지원하지 않으면 렌더링하지 않음
  if (
    !supportsEventProcess &&
    !supportsUserActivity &&
    eventSourceFields.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">
          Event Integration
        </Label>
      </div>

      <div className="space-y-4">
        {/* Event Process Enabled */}
        {supportsEventProcess && (
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              Event Process
            </Label>
            <Controller
              name="eventProcessEnabled"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "enabled" : "disabled"}
                  onValueChange={(value: string) =>
                    field.onChange(value === "enabled")
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enabled" id="event-enabled" />
                    <Label htmlFor="event-enabled" className="text-sm">
                      Enabled
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="disabled" id="event-disabled" />
                    <Label htmlFor="event-disabled" className="text-sm">
                      Disabled
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        )}

        {/* User Activity Enabled */}
        {supportsUserActivity && (
          <div>
            <Label className="text-sm text-gray-600 mb-2 block">
              User Activity
            </Label>
            <Controller
              name="userActivityEnabled"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value ? "enabled" : "disabled"}
                  onValueChange={(value: string) =>
                    field.onChange(value === "enabled")
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enabled" id="activity-enabled" />
                    <Label htmlFor="activity-enabled" className="text-sm">
                      Enabled
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="disabled" id="activity-disabled" />
                    <Label htmlFor="activity-disabled" className="text-sm">
                      Disabled
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        )}

        {/* Dynamic Event Source Fields */}
        {eventSourceFields.map((field) => (
          <DynamicField
            key={field.key}
            config={field}
            value={
              (watchedEventSource &&
                (watchedEventSource as Record<string, string>)[field.key]) ||
              ""
            }
            onChange={(value) =>
              handleEventSourceFieldChange(field.key, value as string)
            }
            error={
              errors.eventSource &&
              typeof errors.eventSource === "object" &&
              field.key in errors.eventSource
                ? (errors.eventSource as Record<string, { message?: string }>)[
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
