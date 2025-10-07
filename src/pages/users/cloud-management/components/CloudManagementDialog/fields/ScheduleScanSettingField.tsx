import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormType } from "@/pages/users/cloud-management/models/ProviderFormType";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ScheduleScanFrequency,
  ScheduleScanWeekday,
  ScheduleScanSetting,
} from "../../../models/cloudTypes";

export function ScheduleScanSettingField() {
  const { control } = useFormContext<FormType>();

  return (
    <div className="flex flex-col gap-4">
      <Label>Schedule Scan Setting</Label>

      <Controller
        name="scheduleScanSetting"
        control={control}
        render={({ field }) => {
          const { value } = field;
          if (value == null) return <></>;

          const updateField = (updates: Partial<ScheduleScanSetting>) => {
            const newValue = { ...value, ...updates };

            if (updates.frequency) {
              switch (updates.frequency) {
                case "HOUR":
                  newValue.date = undefined;
                  newValue.weekday = undefined;
                  newValue.hour = undefined;
                  newValue.minute = undefined;
                  break;
                case "DAY":
                  newValue.date = undefined;
                  newValue.weekday = undefined;
                  break;
                case "WEEK":
                  newValue.date = undefined;
                  break;
                case "MONTH":
                  newValue.weekday = undefined;
                  break;
              }
            }

            field.onChange(newValue);
          };

          return (
            <div className="space-y-4">
              <FrequencyField
                value={value.frequency}
                onChange={(frequency) => updateField({ frequency })}
              />
              <MinuteField
                minute={value.minute}
                onChange={(minute) => {
                  if (value.frequency !== "HOUR") {
                    updateField({ minute });
                  }
                }}
              />
              <HourField
                value={value.frequency}
                hour={value.hour}
                onChange={(hour) => {
                  if (value.frequency !== "HOUR") {
                    updateField({ hour });
                  }
                }}
              />
              <WeekdayField
                value={value.frequency}
                weekday={value.weekday}
                onChange={(weekday) => {
                  if (value.frequency === "WEEK") {
                    updateField({ weekday });
                  }
                }}
              />
              <DateField
                value={value.frequency}
                date={value.date}
                onChange={(date) => {
                  if (value.frequency === "MONTH") {
                    updateField({ date });
                  }
                }}
              />
            </div>
          );
        }}
      />
    </div>
  );
}

function FrequencyField({
  value,
  onChange,
}: {
  value: ScheduleScanFrequency;
  onChange: (value: ScheduleScanFrequency) => void;
}) {
  const frequencyOptions = [
    { value: "HOUR", label: "Hourly" },
    { value: "DAY", label: "Daily" },
    { value: "WEEK", label: "Weekly" },
    { value: "MONTH", label: "Monthly" },
  ] as const;

  return (
    <div className="flex flex-col gap-2">
      <Label>Scan Frequency</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-4 gap-2"
      >
        {frequencyOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`frequency-${option.value}`}
            />
            <Label
              htmlFor={`frequency-${option.value}`}
              className="cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

function DateField({
  value,
  date,
  onChange,
}: {
  value?: ScheduleScanFrequency;
  date?: string;
  onChange: (value: string) => void;
}) {
  // 1일부터 28일까지 선택 가능
  const dateOptions = Array.from({ length: 28 }, (_, i) => (i + 1).toString());

  return (
    <div className="flex flex-col gap-2">
      <Label>Date</Label>
      <Select
        value={date || ""}
        onValueChange={onChange}
        disabled={value !== "MONTH"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Date" />
        </SelectTrigger>
        <SelectContent>
          {dateOptions.map((date) => (
            <SelectItem key={date} value={date}>
              {date}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function WeekdayField({
  value,
  weekday,
  onChange,
}: {
  value?: ScheduleScanFrequency;
  weekday?: ScheduleScanWeekday;
  onChange: (value: ScheduleScanWeekday) => void;
}) {
  const weekdayOptions: { value: ScheduleScanWeekday; label: string }[] = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Label>Day of Week</Label>
      <Select
        value={weekday || ""}
        onValueChange={onChange}
        disabled={value !== "WEEK"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Day of Week" />
        </SelectTrigger>
        <SelectContent>
          {weekdayOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function HourField({
  value,
  hour,
  onChange,
}: {
  value?: ScheduleScanFrequency;
  hour?: string;
  onChange: (value: string) => void;
}) {
  // 0시부터 23시까지 선택 가능
  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString());

  return (
    <div className="flex flex-col gap-2">
      <Label>Hour</Label>
      <Select
        value={hour || ""}
        onValueChange={onChange}
        disabled={value === "HOUR"}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Hour" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((hour) => (
            <SelectItem key={hour} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function MinuteField({
  minute,
  onChange,
}: {
  minute?: string;
  onChange: (value: string) => void;
}) {
  // 0분부터 55분까지 5분 단위로 선택 가능
  const minuteOptions = Array.from({ length: 12 }, (_, i) =>
    (i * 5).toString()
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>Minute</Label>
      <Select value={minute || ""} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Minute" />
        </SelectTrigger>
        <SelectContent>
          {minuteOptions.map((minute) => (
            <SelectItem key={minute} value={minute}>
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
