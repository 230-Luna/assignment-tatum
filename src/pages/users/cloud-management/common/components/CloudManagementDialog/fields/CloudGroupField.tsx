import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { CLOUD_GROUP_OPTIONS } from "@/pages/users/cloud-management/common/constants/cloud";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";

export function CloudGroupField() {
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);

  const { watch, setValue } = useFormContext<FormType>();

  const watchedCloudGroupName = watch("cloudGroupName");

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">Cloud Group</Label>
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
  );
}
