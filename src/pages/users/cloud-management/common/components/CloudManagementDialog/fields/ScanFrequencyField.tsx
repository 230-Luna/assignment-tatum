import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isFeatureSupported } from "@/pages/users/cloud-management/common/utils/providerUtils";
import { FormType } from "../index";

const SCAN_HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return {
    value: hour,
    label: `${hour}`,
  };
});

const SCAN_MINUTES = Array.from({ length: 13 }, (_, i) => {
  const minute = (i * 5).toString().padStart(2, "0");
  return {
    value: minute,
    label: minute,
  };
});

export function ScanFrequencyField() {
  const { control, watch } = useFormContext<FormType>();

  const watchedProvider = watch("provider");
  const watchedScheduleScanEnabled = watch("scheduleScanEnabled");
  const watchedScanFrequency = watch("scheduleScanSetting");

  const supportsScheduleScan = isFeatureSupported(
    watchedProvider,
    "scheduleScan"
  );

  if (!supportsScheduleScan || !watchedScheduleScanEnabled) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">
        Set Scan Frequency
      </Label>

      <div className="text-sm text-gray-600 mb-3">
        Scan Schedule: Daily 12:00 AM
      </div>

      <Controller
        name="scheduleScanSetting.frequency"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOUR">Hourly</SelectItem>
              <SelectItem value="DAY">Daily</SelectItem>
              <SelectItem value="WEEK">Weekly</SelectItem>
              <SelectItem value="MONTH">Monthly</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      {/* Frequency specific fields */}
      <div className="grid grid-cols-3 gap-4">
        {watchedScanFrequency?.frequency === "MONTH" && (
          <div>
            <Label className="text-sm text-gray-600 mb-1 block">Date</Label>
            <Controller
              name="scheduleScanSetting.date"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        {watchedScanFrequency?.frequency === "WEEK" && (
          <div>
            <Label className="text-sm text-gray-600 mb-1 block">
              Day of Week
            </Label>
            <Controller
              name="scheduleScanSetting.weekday"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MON">Monday</SelectItem>
                    <SelectItem value="TUE">Tuesday</SelectItem>
                    <SelectItem value="WED">Wednesday</SelectItem>
                    <SelectItem value="THU">Thursday</SelectItem>
                    <SelectItem value="FRI">Friday</SelectItem>
                    <SelectItem value="SAT">Saturday</SelectItem>
                    <SelectItem value="SUN">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        {watchedScanFrequency?.frequency !== "HOUR" && (
          <div>
            <Label className="text-sm text-gray-600 mb-1 block">Hour</Label>
            <Controller
              name="scheduleScanSetting.hour"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {SCAN_HOURS.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        <div>
          <Label className="text-sm text-gray-600 mb-1 block">Minute</Label>
          <Controller
            name="scheduleScanSetting.minute"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCAN_MINUTES.map((minute) => (
                    <SelectItem key={minute.value} value={minute.value}>
                      {minute.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
