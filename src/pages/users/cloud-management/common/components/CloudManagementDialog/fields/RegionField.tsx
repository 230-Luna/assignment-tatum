import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { FormType } from "@/pages/users/cloud-management/common/models/ProviderFormType";
import {
  AWSRegionList,
  AzureRegionList,
  GCPRegionList,
} from "@/pages/users/cloud-management/common/models/cloudTypes";

export function RegionField() {
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);

  const { watch, setValue } = useFormContext<FormType>();

  const watchedProvider = watch("provider");
  const regionList = watch("regionList") || [];

  const getAvailableRegions = () => {
    switch (watchedProvider) {
      case "AWS":
        return [...AWSRegionList];
      case "AZURE":
        return [...AzureRegionList];
      case "GCP":
        return [...GCPRegionList];
      default:
        return [];
    }
  };

  const availableRegions = getAvailableRegions();

  const handleRegionToggle = (region: string) => {
    if (region === "global") {
      return;
    }

    const newRegionList = regionList.includes(region)
      ? regionList.filter((r) => r !== region)
      : [...regionList, region];

    setValue("regionList", newRegionList);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>Region</Label>
      </div>
      <div className="relative">
        <div className="border rounded-md bg-white">
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
          >
            <span className="text-sm text-gray-700">
              {regionList.length > 0
                ? `${regionList.length} regions selected`
                : "Select regions"}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                regionDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {regionDropdownOpen && (
            <div className="border-t max-h-48 overflow-y-auto">
              {availableRegions.map((region) => (
                <div
                  key={region}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRegionToggle(region)}
                >
                  <span className="text-sm text-gray-700">
                    {region}
                    {region === "global" && " (default)"}
                  </span>
                  {regionList.includes(region) && (
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
      {regionList.length > 0 && (
        <div className="text-xs text-gray-500">
          Selected regions: {regionList.join(", ")}
        </div>
      )}
    </div>
  );
}
