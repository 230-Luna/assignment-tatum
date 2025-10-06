import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { getRegionList } from "@/pages/users/cloud-management/common/utils/providerUtils";
import { FormType } from "../index";

export function RegionField() {
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const { watch, setValue } = useFormContext<FormType>();

  const watchedProvider = watch("provider");
  const watchedRegionList = watch("regionList");

  const regionList = getRegionList(watchedProvider);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-gray-700">Region</Label>
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
                    const newRegionList = watchedRegionList.includes(region)
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
                        region === "global" ? "text-gray-400" : "text-blue-600"
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
  );
}
