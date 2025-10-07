import { Cloud } from "@/pages/users/cloud-management/models/cloudTypes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { SSRSuspense } from "@/components/SSRSuspense";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { fetchAllCloudsQueryOptions } from "./query-options/cloudManagement";
import { Skeleton } from "@/components/Skeleton";
import { useCloudManagementDialog } from "./hooks/useCloudManagementDialog";

export function CloudManagementPage() {
  return (
    <SSRSuspense fallback={<Skeleton />}>
      <CloudTable />
    </SSRSuspense>
  );
}

export function CloudTable() {
  const { data: clouds } = useSuspenseQuery(fetchAllCloudsQueryOptions());

  const openCloudManagementDialog = useCloudManagementDialog();

  const handleCreateCloudButtonlick = useMutation({
    mutationFn: async () => {
      try {
        const result = await openCloudManagementDialog();
        if (result == null) {
          return;
        }
        console.log("서버 전송용 페이로드:", result);
      } catch (error) {
        window.alert("An error occurred while creating the cloud.");
      }
    },
  });

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cloud Management</h1>
        <Button
          disabled={handleCreateCloudButtonlick.isPending}
          onClick={() => handleCreateCloudButtonlick.mutate()}
          icon={<Plus />}
        >
          Create Cloud
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Cloud Group</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Event Process</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clouds.map((cloud) => (
              <CloudTableRow key={cloud.id} cloud={cloud} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CloudTableRow({ cloud }: { cloud: Cloud }) {
  const confirmDialog = useConfirmDialog();
  const openCloudManagementDialog = useCloudManagementDialog();

  const handleEditCloudButtonClick = useMutation({
    mutationFn: async () => {
      const result = await openCloudManagementDialog({ initialData: cloud });

      if (result == null) {
        return;
      }
      console.log("서버 전송용 페이로드:", result);
    },
  });

  const handleDeleteCloudButtonClick = useMutation({
    mutationFn: async () => {
      try {
        const confirmed = await confirmDialog.open({
          content: "Are you sure you want to delete this cloud?",
          cancelButtonText: "Cancel",
          confirmButtonText: "Delete",
        });

        if (confirmed) {
          // CLOUD DELETE API CALL
        }
      } catch (error) {
        window.alert("An error occurred while deleting the cloud.");
      }
    },
  });

  return (
    <TableRow key={cloud.id}>
      <TableCell>
        <Image
          src={`/cloudLogo/icon-${cloud.provider.toLowerCase()}.svg`}
          alt={cloud.provider}
          width={32}
          height={32}
          draggable={false}
        />
      </TableCell>
      <TableCell className="font-medium">{cloud.name}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {cloud.cloudGroupName?.map((group, index) => (
            <Badge key={index} variant="blue">
              {group}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {cloud.credentials && "accessKeyId" in cloud.credentials
          ? cloud.credentials.accessKeyId
          : "-"}
      </TableCell>
      <TableCell>
        {cloud.eventProcessEnabled && cloud.scheduleScanEnabled ? (
          <Badge variant="blue">READY</Badge>
        ) : (
          <Badge variant="red">ERROR</Badge>
        )}
      </TableCell>
      <TableCell>
        {cloud.eventProcessEnabled ? (
          <Badge variant="green">VALID</Badge>
        ) : (
          <Badge variant="orange">INVALID</Badge>
        )}
      </TableCell>
      <TableCell>
        <IconButton
          variant="ghost"
          size="icon-sm"
          disabled={
            handleEditCloudButtonClick.isPending ||
            handleDeleteCloudButtonClick.isPending
          }
          onClick={() => handleEditCloudButtonClick.mutate()}
          icon={<Edit />}
        />
      </TableCell>
      <TableCell>
        <IconButton
          variant="ghost"
          size="icon-sm"
          disabled={
            handleEditCloudButtonClick.isPending ||
            handleDeleteCloudButtonClick.isPending
          }
          onClick={() => handleDeleteCloudButtonClick.mutate()}
          icon={<Trash2 />}
        />
      </TableCell>
    </TableRow>
  );
}
