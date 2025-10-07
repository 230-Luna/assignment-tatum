import { Cloud } from "@/pages/users/cloud-management/models/cloudTypes";
import { fetchAllClouds } from "@/mocks/cloudManagementData";
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
import { useSuspenseQuery } from "@tanstack/react-query";
import { SSRSuspense } from "@/components/SSRSuspense";

import { CloudManagementDialog } from "./components/CloudManagementDialog";
import { useOverlay } from "@/hooks/useOverlay";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { Edit, Plus, Trash2 } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { FormType } from "./models/ProviderFormType";
import { fetchAllCloudsQueryOptions } from "./query-options/cloudManagement";
import { Skeleton } from "@/components/Skeleton";

export function CloudManagementPage() {
  return (
    <SSRSuspense fallback={<Skeleton />}>
      <CloudTable />
    </SSRSuspense>
  );
}

export function CloudTable() {
  const { data: clouds } = useSuspenseQuery(fetchAllCloudsQueryOptions());

  const overlay = useOverlay();

  const handleCreateCloud = async () => {
    const result = await new Promise<FormType | null>((resolve) => {
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
        />
      ));
    });

    if (result == null) {
      return;
    }
  };

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Cloud Management</h1>
        <Button onClick={handleCreateCloud} icon={<Plus />}>
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
  const overlay = useOverlay();
  const confirmDialog = useConfirmDialog();

  const handleEditCloud = async (cloud: Cloud) => {
    const result = await new Promise<FormType | null>((resolve) => {
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
          cloudId={cloud.id}
        />
      ));
    });

    if (result == null) {
      return;
    }
  };

  const handleDeleteCloud = async (cloud: Cloud) => {
    const confirmed = await confirmDialog.open({
      content: "Are you sure you want to delete this cloud?",
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete",
    });

    if (confirmed) {
      return cloud;
    }
  };

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
        <Badge
          variant={
            cloud.eventProcessEnabled && cloud.scheduleScanEnabled
              ? "blue"
              : "red"
          }
        >
          {cloud.eventProcessEnabled && cloud.scheduleScanEnabled
            ? "READY"
            : "ERROR"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={cloud.eventProcessEnabled ? "green" : "orange"}>
          {cloud.eventProcessEnabled ? "VALID" : "INVALID"}
        </Badge>
      </TableCell>
      <TableCell>
        <IconButton
          variant="ghost"
          size="icon-sm"
          onClick={() => handleEditCloud(cloud)}
          icon={<Edit />}
        />
      </TableCell>
      <TableCell>
        <IconButton
          variant="ghost"
          size="icon-sm"
          onClick={() => handleDeleteCloud(cloud)}
          icon={<Trash2 />}
        />
      </TableCell>
    </TableRow>
  );
}
