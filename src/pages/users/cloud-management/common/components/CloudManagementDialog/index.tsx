import { useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, ChevronDown } from "lucide-react";
import {
  Provider,
  ScheduleScanSetting,
  AWSCredential,
  AzureCredential,
  GCPCredential,
  AWSCredentialType,
  AzureCredentialType,
  GCPCredentialType,
  AWSEventSource,
  AzureEventSource,
  GCPEventSource,
} from "@/pages/users/cloud-management/common/models/cloudTypes";
import { CLOUD_GROUP_OPTIONS } from "@/pages/users/cloud-management/common/constants/cloud";
import {
  getProviderConfig,
  getCredentialFields,
  getEventSourceFields,
  getRegionList,
  isFeatureSupported,
} from "@/pages/users/cloud-management/common/utils/providerUtils";
import { DynamicField } from "@/components/DynamicField";
import { getSchemaByProvider } from "@/pages/users/cloud-management/common/schemas/validationSchemas";
import { CloudNameField } from "./fields/CloudNameField";
import { SelectProviderField } from "./fields/SelectProviderField";
import { CredentialTypeField } from "./fields/CredentialTypeField";

// 프로바이더별 FormType 정의
export type AWSFormType = {
  provider: "AWS";
  name: string;
  cloudGroupName?: string[];
  eventProcessEnabled: boolean;
  userActivityEnabled: boolean;
  scheduleScanEnabled: boolean;
  scheduleScanSetting?: ScheduleScanSetting;
  regionList: string[];
  proxyUrl?: string;
  credentials: AWSCredential;
  credentialType: AWSCredentialType;
  eventSource?: AWSEventSource;
};

export type AzureFormType = {
  provider: "AZURE";
  name: string;
  cloudGroupName?: string[];
  eventProcessEnabled: boolean;
  userActivityEnabled: boolean;
  scheduleScanEnabled: boolean;
  scheduleScanSetting?: ScheduleScanSetting;
  regionList: string[];
  proxyUrl?: string;
  credentials: AzureCredential;
  credentialType: AzureCredentialType;
  eventSource?: AzureEventSource;
};

export type GCPFormType = {
  provider: "GCP";
  name: string;
  cloudGroupName?: string[];
  eventProcessEnabled: boolean;
  userActivityEnabled: boolean;
  scheduleScanEnabled: boolean;
  scheduleScanSetting?: ScheduleScanSetting;
  regionList: string[];
  proxyUrl?: string;
  credentials: GCPCredential;
  credentialType: GCPCredentialType;
  eventSource?: GCPEventSource;
};

export type FormType = AWSFormType | AzureFormType | GCPFormType;

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

// 프로바이더별 기본값 생성 함수
export const getDefaultFormValues = (provider: Provider): FormType => {
  const providerConfig = getProviderConfig(provider);
  const defaultCredentialType = providerConfig.credentialTypes.find(
    (type) => !type.disabled
  )?.value;

  const baseValues = {
    name: "",
    cloudGroupName: [],
    regionList: ["global"],
    proxyUrl: "",
    eventProcessEnabled: false,
    userActivityEnabled: false,
    scheduleScanEnabled: false,
    scheduleScanSetting: {
      frequency: "HOUR" as const,
      hour: "0",
      minute: "0",
    },
    eventSource: undefined,
  };

  switch (provider) {
    case "AWS":
      return {
        ...baseValues,
        provider: "AWS",
        credentialType:
          (defaultCredentialType as AWSCredentialType) || "ACCESS_KEY",
        credentials: {} as AWSCredential,
      } as AWSFormType;

    case "AZURE":
      return {
        ...baseValues,
        provider: "AZURE",
        credentialType:
          (defaultCredentialType as AzureCredentialType) || "APPLICATION",
        credentials: {} as AzureCredential,
      } as AzureFormType;

    case "GCP":
      return {
        ...baseValues,
        provider: "GCP",
        credentialType:
          (defaultCredentialType as GCPCredentialType) || "JSON_TEXT",
        credentials: {} as GCPCredential,
      } as GCPFormType;

    default:
      return {
        ...baseValues,
        provider: "AWS",
        credentialType: "ACCESS_KEY",
        credentials: {} as AWSCredential,
      } as AWSFormType;
  }
};

export function CloudManagementDialog({
  open,
  onClose,
  onComplete,
  data,
}: {
  open: boolean;
  onClose: () => void;
  onComplete: ({ data }: { data?: FormType }) => void;
  data?: FormType;
}) {
  const [showPasswordFields, setShowPasswordFields] = useState<
    Record<string, boolean>
  >({});
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);

  const form = useForm<FormType>({
    defaultValues: data ?? getDefaultFormValues("AWS"),
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
    setError,
  } = form;

  // 폼 데이터 감시
  const watchedProvider = watch("provider");
  const watchedCredentialType = watch("credentialType");
  const watchedScheduleScanEnabled = watch("scheduleScanEnabled");
  const watchedScanFrequency = watch("scheduleScanSetting");
  const watchedRegionList = watch("regionList");
  const watchedCloudGroupName = watch("cloudGroupName");
  const watchedCredentials = watch("credentials");
  const watchedEventSource = watch("eventSource");

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
    const credentialFields = getCredentialFields(
      watchedProvider,
      watchedCredentialType
    );
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

  const handleEventSourceFieldChange = (fieldKey: string, value: string) => {
    const currentEventSource = getValues("eventSource");
    setValue("eventSource", {
      ...currentEventSource,
      [fieldKey]: value,
    });
  };

  const togglePasswordVisibility = (fieldKey: string) => {
    setShowPasswordFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleCancel = () => {
    reset(data);
    onClose();
  };

  const onSubmit = (formData: FormType) => {
    // 수동 Zod 유효성 검사
    const schema = getSchemaByProvider(formData.provider);
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      // 유효성 검사 실패 시 에러를 폼 필드에 설정
      clearErrors();
      validationResult.error.issues.forEach((err) => {
        const path = err.path.join(".");
        setError(path as keyof FormType, {
          type: "manual",
          message: err.message,
        });
      });
      return;
    }

    // 검증 성공 시 에러 클리어
    clearErrors();

    // 서버 전송용 페이로드 생성
    const payload = {
      ...formData,
      scheduleScanSetting: formData.scheduleScanEnabled
        ? {
            frequency: formData.scheduleScanSetting?.frequency as
              | "HOUR"
              | "DAY"
              | "WEEK"
              | "MONTH",
            ...(formData.scheduleScanSetting?.frequency === "MONTH" && {
              date: formData.scheduleScanSetting?.date,
            }),
            ...(formData.scheduleScanSetting?.frequency === "WEEK" && {
              weekday: formData.scheduleScanSetting?.weekday as
                | "MON"
                | "TUE"
                | "WED"
                | "THU"
                | "FRI"
                | "SAT"
                | "SUN",
            }),
            ...(formData.scheduleScanSetting?.frequency !== "HOUR" && {
              hour: formData.scheduleScanSetting?.hour,
            }),
            minute: formData.scheduleScanSetting?.minute,
          }
        : undefined,
    } as FormType;

    onComplete({ data: payload });
    console.log("서버 전송용 페이로드:", payload);
  };

  // 확인 버튼 클릭 핸들러 (disabled 상태에서도 유효성 검사 실행)
  const handleConfirmClick = () => {
    const formData = getValues();

    // 필수 필드 검증 및 에러 설정
    let hasErrors = false;

    // Cloud Name 검증
    if (!formData.name?.trim()) {
      setError("name", {
        type: "manual",
        message: "Cloud Name는 필수입니다.",
      });
      hasErrors = true;
    }

    // Credentials 필수 필드 검증
    const credentialFields = getCredentialFields(
      watchedProvider,
      watchedCredentialType
    );
    const requiredCredentialFields = credentialFields.filter(
      (field) => field.required
    );

    for (const field of requiredCredentialFields) {
      const value = (watchedCredentials as unknown as Record<string, string>)?.[
        field.key
      ];
      if (!value?.trim()) {
        setError(`credentials.${field.key}` as keyof FormType, {
          type: "manual",
          message: `${field.label}는 필수입니다.`,
        });
        hasErrors = true;
      }
    }

    // 에러가 있으면 제출하지 않음
    if (hasErrors) {
      return;
    }

    // 에러가 없으면 정상 제출
    handleSubmit(onSubmit)();
  };

  const renderStep1 = () => {
    const credentialFields = getCredentialFields(
      watchedProvider,
      watchedCredentialType
    );
    const regionList = getRegionList(watchedProvider);

    return (
      <FormProvider {...form}>
        <div className="space-y-6">
          <CloudNameField />
          <SelectProviderField />
          <CredentialTypeField />

          {/* Dynamic Credentials Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Credentials
              </Label>
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
                      ? (
                          errors.credentials as Record<
                            string,
                            { message?: string }
                          >
                        )[field.key]?.message
                      : undefined
                  }
                />
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Region
              </Label>
            </div>
            <div className="relative">
              <div className="border rounded-md bg-white">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                >
                  <span className="text-sm text-gray-700">
                    {watchedRegionList.length > 0
                      ? `${watchedRegionList.length}개 지역 선택됨`
                      : "지역을 선택하세요"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      regionDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {regionDropdownOpen && (
                  <div className="border-t max-h-48 overflow-y-auto">
                    {regionList.map((region) => (
                      <div
                        key={region}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (region === "global") {
                            // global은 항상 포함되어야 하므로 해제 불가
                            return;
                          }
                          const newRegionList = watchedRegionList.includes(
                            region
                          )
                            ? watchedRegionList.filter((r) => r !== region)
                            : [...watchedRegionList, region];
                          setValue("regionList", newRegionList);
                        }}
                      >
                        <span className="text-sm text-gray-700">
                          {region}
                          {region === "global" && " (기본 포함)"}
                        </span>
                        {watchedRegionList.includes(region) && (
                          <Check
                            className={`h-4 w-4 ${
                              region === "global"
                                ? "text-gray-400"
                                : "text-blue-600"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {watchedRegionList.length > 0 && (
              <div className="text-xs text-gray-500">
                선택된 지역: {watchedRegionList.join(", ")}
              </div>
            )}
          </div>

          {/* Cloud Group */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Cloud Group
            </Label>
            <div className="relative">
              <div className="border rounded-md bg-white">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                >
                  <span className="text-sm text-gray-700">
                    {watchedCloudGroupName && watchedCloudGroupName.length > 0
                      ? `${watchedCloudGroupName.length}개 그룹 선택됨`
                      : "클라우드 그룹을 선택하세요"}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      groupDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {groupDropdownOpen && (
                  <div className="border-t max-h-48 overflow-y-auto">
                    {CLOUD_GROUP_OPTIONS.map((group) => (
                      <div
                        key={group}
                        className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          const currentGroups = watchedCloudGroupName || [];
                          const newGroupList = currentGroups.includes(group)
                            ? currentGroups.filter((g) => g !== group)
                            : [...currentGroups, group];
                          setValue("cloudGroupName", newGroupList);
                        }}
                      >
                        <span className="text-sm text-gray-700">{group}</span>
                        {watchedCloudGroupName?.includes(group) && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {watchedCloudGroupName && watchedCloudGroupName.length > 0 && (
              <div className="text-xs text-gray-500">
                선택된 그룹: {watchedCloudGroupName.join(", ")}
              </div>
            )}
          </div>

          {/* Proxy URL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Proxy URL
              </Label>
            </div>
            <Controller
              name="proxyUrl"
              control={control}
              render={({ field }) => (
                <div>
                  <Input
                    placeholder="Please enter the proxy URL."
                    {...field}
                    className={`w-full ${
                      errors.proxyUrl ? "border-red-500" : ""
                    }`}
                  />
                  {errors.proxyUrl && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.proxyUrl.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </FormProvider>
    );
  };

  const renderStep2 = () => {
    const eventSourceFields = getEventSourceFields(watchedProvider);
    const supportsScheduleScan = isFeatureSupported(
      watchedProvider,
      "scheduleScan"
    );
    const supportsEventProcess = isFeatureSupported(
      watchedProvider,
      "eventProcess"
    );
    const supportsUserActivity = isFeatureSupported(
      watchedProvider,
      "userActivity"
    );

    return (
      <div className="space-y-6">
        {/* Scan Schedule Setting */}
        {supportsScheduleScan && (
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Scan Schedule Setting
            </Label>

            <Controller
              name="scheduleScanEnabled"
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
                    <RadioGroupItem value="enabled" id="enabled" />
                    <Label htmlFor="enabled" className="text-sm">
                      Enabled
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="disabled" id="disabled" />
                    <Label htmlFor="disabled" className="text-sm">
                      Disabled
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        )}

        {/* Set Scan Frequency */}
        {supportsScheduleScan && watchedScheduleScanEnabled && (
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
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Date
                  </Label>
                  <Controller
                    name="scheduleScanSetting.date"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                  <Label className="text-sm text-gray-600 mb-1 block">
                    Hour
                  </Label>
                  <Controller
                    name="scheduleScanSetting.hour"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
                <Label className="text-sm text-gray-600 mb-1 block">
                  Minute
                </Label>
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
        )}

        {/* Event Integration */}
        {(supportsEventProcess ||
          supportsUserActivity ||
          eventSourceFields.length > 0) && (
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
                          <RadioGroupItem
                            value="disabled"
                            id="event-disabled"
                          />
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
                          <RadioGroupItem
                            value="enabled"
                            id="activity-enabled"
                          />
                          <Label htmlFor="activity-enabled" className="text-sm">
                            Enabled
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="disabled"
                            id="activity-disabled"
                          />
                          <Label
                            htmlFor="activity-disabled"
                            className="text-sm"
                          >
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
                      (watchedEventSource as Record<string, string>)[
                        field.key
                      ]) ||
                    ""
                  }
                  onChange={(value) =>
                    handleEventSourceFieldChange(field.key, value as string)
                  }
                  error={
                    errors.eventSource &&
                    typeof errors.eventSource === "object" &&
                    field.key in errors.eventSource
                      ? (
                          errors.eventSource as Record<
                            string,
                            { message?: string }
                          >
                        )[field.key]?.message
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
            </div>
            {data ? "Edit" : "Create"} Cloud
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          {/* Step 1 - Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h3>
            {renderStep1()}
          </div>

          {/* Step 2 - Scan & Event Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Scan & Event Settings
            </h3>
            {renderStep2()}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="button" onClick={handleConfirmClick}>
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
