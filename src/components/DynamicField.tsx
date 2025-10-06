import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, HelpCircle, Check, ChevronDown } from "lucide-react";
import { FieldConfig } from "@/pages/users/cloud-management/common/models/providerConfigs";

interface DynamicFieldProps {
  config: FieldConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  dropdownOpen?: boolean;
  onToggleDropdown?: () => void;
  allOptions?: readonly string[];
  error?: string;
}

export function DynamicField({
  config,
  value,
  onChange,
  showPassword = false,
  onTogglePassword,
  dropdownOpen = false,
  onToggleDropdown,
  allOptions,
  error,
}: DynamicFieldProps) {
  const { key, label, type, required, placeholder, options, helpText } = config;

  const renderField = () => {
    switch (type) {
      case "text":
        return (
          <Input
            id={key}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${error ? "border-red-500" : ""}`}
          />
        );

      case "password":
        return (
          <div className="relative">
            <Input
              id={key}
              type={showPassword ? "text" : "password"}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`w-full pr-10 ${error ? "border-red-500" : ""}`}
            />
            {onTogglePassword && (
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        );

      case "select":
        return (
          <Select
            value={typeof value === "string" ? value : ""}
            onValueChange={(val) => onChange(val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : [];
        const availableOptions =
          allOptions || options?.map((opt) => opt.value) || [];

        return (
          <div className="relative">
            <div className="border rounded-md bg-white">
              <div
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={onToggleDropdown}
              >
                <span className="text-sm text-gray-700">
                  {selectedValues.length > 0
                    ? `${selectedValues.length}개 선택됨`
                    : placeholder || "선택하세요"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {dropdownOpen && (
                <div className="border-t max-h-48 overflow-y-auto">
                  {availableOptions.map((option) => (
                    <div
                      key={option}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        if (option === "global") {
                          return;
                        }
                        const newValues = selectedValues.includes(option)
                          ? selectedValues.filter((v) => v !== option)
                          : [...selectedValues, option];
                        onChange(newValues);
                      }}
                    >
                      <span className="text-sm text-gray-700">
                        {option}
                        {option === "global" && " (기본 포함)"}
                      </span>
                      {selectedValues.includes(option) && (
                        <Check
                          className={`h-4 w-4 ${
                            option === "global"
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
            {selectedValues.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                선택된 항목: {selectedValues.join(", ")}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={key} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {helpText && <HelpCircle className="h-4 w-4 text-gray-400" />}
      </div>
      {renderField()}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
