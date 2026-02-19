import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required"),
  plate: z.string().min(1, "License plate is required"),
  vin: z.string().optional(),
  status: z.enum(["In-House", "Loaned", "Maintenance"]),
  type: z.string().min(1, "Vehicle type is required"),
  color: z.string().optional(),
  mileage: z.coerce.number().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  plate: string;
  vin?: string;
  status: string;
  type: string;
  color?: string;
  mileage?: number;
}

interface VehicleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSave: (data: VehicleFormData & { id?: string }) => void;
  mode: "add" | "edit";
}

export function VehicleEditDialog({
  open,
  onOpenChange,
  vehicle,
  onSave,
  mode,
}: VehicleEditDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle
      ? {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          plate: vehicle.plate,
          vin: vehicle.vin || "",
          status: vehicle.status as "In-House" | "Loaned" | "Maintenance",
          type: vehicle.type,
          color: vehicle.color || "",
          mileage: vehicle.mileage,
        }
      : {
          status: "In-House",
        },
  });

  const status = watch("status");

  React.useEffect(() => {
    if (vehicle) {
      reset({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        vin: vehicle.vin || "",
        status: vehicle.status as "In-House" | "Loaned" | "Maintenance",
        type: vehicle.type,
        color: vehicle.color || "",
        mileage: vehicle.mileage,
      });
    } else {
      reset({
        status: "In-House",
        make: "",
        model: "",
        year: "",
        plate: "",
        vin: "",
        type: "",
        color: "",
        mileage: undefined,
      });
    }
  }, [vehicle, reset]);

  const onFormSubmit = (data: VehicleFormData) => {
    if (mode === "edit" && vehicle) {
      onSave({ ...data, id: vehicle.id });
    } else {
      onSave(data);
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Make *</Label>
              <Input
                id="make"
                {...register("make")}
                placeholder="Toyota, Honda, etc."
              />
              {errors.make && (
                <p className="text-sm text-red-500">{errors.make.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                {...register("model")}
                placeholder="Camry, CR-V, etc."
              />
              {errors.model && (
                <p className="text-sm text-red-500">{errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                {...register("year")}
                placeholder="2024"
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Input
                id="type"
                {...register("type")}
                placeholder="Sedan, SUV, Truck, etc."
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="plate">License Plate *</Label>
              <Input
                id="plate"
                {...register("plate")}
                placeholder="ABC-1234"
              />
              {errors.plate && (
                <p className="text-sm text-red-500">{errors.plate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                {...register("vin")}
                placeholder="Vehicle Identification Number"
              />
              {errors.vin && (
                <p className="text-sm text-red-500">{errors.vin.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as "In-House" | "Loaned" | "Maintenance")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In-House">In-House</SelectItem>
                  <SelectItem value="Loaned">Loaned</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                {...register("color")}
                placeholder="Silver, Black, etc."
              />
              {errors.color && (
                <p className="text-sm text-red-500">{errors.color.message}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                {...register("mileage")}
                placeholder="15000"
              />
              {errors.mileage && (
                <p className="text-sm text-red-500">{errors.mileage.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "edit" ? "Save Changes" : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
