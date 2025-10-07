import { useOverlay } from "@/hooks/useOverlay";
import { FormType } from "../models/ProviderFormType";
import { CloudManagementDialog } from "../components/CloudManagementDialog";

export const useCloudManagementDialog = () => {
  const overlay = useOverlay();

  return (payload: { cloudId?: string } = {}) =>
    new Promise<FormType | null>((resolve) => {
      overlay.open(({ isOpen, close }) => (
        <CloudManagementDialog
          open={isOpen}
          onClose={() => {
            close();
            resolve(null);
          }}
          onComplete={({ data }) => {
            close();
            resolve(data || null);
          }}
          cloudId={payload.cloudId}
        />
      ));
    });
};
