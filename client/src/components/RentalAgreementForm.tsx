import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const rentalAgreementSchema = z.object({
  renterName: z.string().min(1, "Renter name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  driversLicense: z.string().min(1, "Driver's license is required"),
  licenseState: z.string().min(1, "License state is required"),
  licenseExpiration: z.string().min(1, "License expiration is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  cellPhone: z.string().min(1, "Cell phone is required"),
  email: z.string().email("Valid email is required"),
  insuranceCompany: z.string().min(1, "Insurance company is required"),
  policyNumber: z.string().min(1, "Policy number is required"),
  policyExpiration: z.string().min(1, "Policy expiration is required"),
  insuranceAgent: z.string().optional(),
  agentPhone: z.string().optional(),
  adjuster: z.string().optional(),
  adjusterPhone: z.string().optional(),
  claimNumber: z.string().optional(),
  dateOfLoss: z.string().optional(),
  originalCarNumber: z.string().optional(),
  originalLicense: z.string().optional(),
  originalYear: z.string().optional(),
  originalMake: z.string().optional(),
  originalModel: z.string().optional(),
  originalColor: z.string().optional(),
  currentCarNumber: z.string().min(1, "Current car number is required"),
  currentLicense: z.string().min(1, "Current license is required"),
  currentYear: z.string().min(1, "Current year is required"),
  currentMake: z.string().min(1, "Current make is required"),
  currentModel: z.string().min(1, "Current model is required"),
  currentColor: z.string().min(1, "Current color is required"),
  dateDueBack: z.string().optional(),
  mileageOut: z.string().optional(),
  fuelGaugeOut: z.string().optional(),
  deposits: z.string().optional(),
  salesTax: z.string().optional(),
  stateSalesTax: z.string().optional(),
  fuelCharges: z.string().optional(),
});

type RentalAgreementFormData = z.infer<typeof rentalAgreementSchema>;

interface RentalAgreementFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RentalAgreementFormData) => void;
}

export function RentalAgreementForm({ open, onOpenChange, onSubmit }: RentalAgreementFormProps) {
  const [activeTab, setActiveTab] = useState("renter");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RentalAgreementFormData>({
    resolver: zodResolver(rentalAgreementSchema),
    defaultValues: {
      salesTax: "8.00",
      stateSalesTax: "7.00",
      fuelCharges: "5.99",
    }
  });

  const onFormSubmit = (data: RentalAgreementFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            TRI-STATE AUTO RENTAL LLC. - New Agreement
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            718 COTTAGE STREET, PAWTUCKET, RI 02861 • 508-761-9700
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="renter">Renter Info</TabsTrigger>
              <TabsTrigger value="vehicle">Vehicle Info</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="rates">Rates & Terms</TabsTrigger>
            </TabsList>

            <TabsContent value="renter" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Renter Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="renterName">Renter's Name *</Label>
                      <Input
                        id="renterName"
                        {...register("renterName")}
                        placeholder="Full name"
                      />
                      {errors.renterName && (
                        <p className="text-sm text-red-500">{errors.renterName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cellPhone">Cell Phone *</Label>
                      <Input
                        id="cellPhone"
                        {...register("cellPhone")}
                        placeholder="(555) 123-4567"
                      />
                      {errors.cellPhone && (
                        <p className="text-sm text-red-500">{errors.cellPhone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      {...register("address")}
                      placeholder="Street address"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-500">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500">{errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        {...register("state")}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-sm text-red-500">{errors.state.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        {...register("zipCode")}
                        placeholder="ZIP"
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-red-500">{errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="driversLicense">Driver's License # *</Label>
                      <Input
                        id="driversLicense"
                        {...register("driversLicense")}
                        placeholder="License number"
                      />
                      {errors.driversLicense && (
                        <p className="text-sm text-red-500">{errors.driversLicense.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseState">State *</Label>
                      <Input
                        id="licenseState"
                        {...register("licenseState")}
                        placeholder="State"
                      />
                      {errors.licenseState && (
                        <p className="text-sm text-red-500">{errors.licenseState.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiration">Expiration *</Label>
                      <Input
                        id="licenseExpiration"
                        type="date"
                        {...register("licenseExpiration")}
                      />
                      {errors.licenseExpiration && (
                        <p className="text-sm text-red-500">{errors.licenseExpiration.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...register("dateOfBirth")}
                      />
                      {errors.dateOfBirth && (
                        <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="email@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vehicle" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Original Vehicle</CardTitle>
                    <p className="text-sm text-muted-foreground">Customer's vehicle</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="originalCarNumber">Car Number/VIN</Label>
                      <Input
                        id="originalCarNumber"
                        {...register("originalCarNumber")}
                        placeholder="VIN"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalLicense">License</Label>
                      <Input
                        id="originalLicense"
                        {...register("originalLicense")}
                        placeholder="License plate"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalYear">Year</Label>
                        <Input
                          id="originalYear"
                          {...register("originalYear")}
                          placeholder="Year"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalMake">Make</Label>
                        <Input
                          id="originalMake"
                          {...register("originalMake")}
                          placeholder="Make"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalModel">Model</Label>
                        <Input
                          id="originalModel"
                          {...register("originalModel")}
                          placeholder="Model"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalColor">Color</Label>
                        <Input
                          id="originalColor"
                          {...register("originalColor")}
                          placeholder="Color"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Current Rental Vehicle</CardTitle>
                    <p className="text-sm text-muted-foreground">Loaned vehicle</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentCarNumber">Car Number/VIN *</Label>
                      <Input
                        id="currentCarNumber"
                        {...register("currentCarNumber")}
                        placeholder="VIN"
                      />
                      {errors.currentCarNumber && (
                        <p className="text-sm text-red-500">{errors.currentCarNumber.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentLicense">License *</Label>
                      <Input
                        id="currentLicense"
                        {...register("currentLicense")}
                        placeholder="License plate"
                      />
                      {errors.currentLicense && (
                        <p className="text-sm text-red-500">{errors.currentLicense.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentYear">Year *</Label>
                        <Input
                          id="currentYear"
                          {...register("currentYear")}
                          placeholder="Year"
                        />
                        {errors.currentYear && (
                          <p className="text-sm text-red-500">{errors.currentYear.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentMake">Make *</Label>
                        <Input
                          id="currentMake"
                          {...register("currentMake")}
                          placeholder="Make"
                        />
                        {errors.currentMake && (
                          <p className="text-sm text-red-500">{errors.currentMake.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentModel">Model *</Label>
                        <Input
                          id="currentModel"
                          {...register("currentModel")}
                          placeholder="Model"
                        />
                        {errors.currentModel && (
                          <p className="text-sm text-red-500">{errors.currentModel.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentColor">Color *</Label>
                        <Input
                          id="currentColor"
                          {...register("currentColor")}
                          placeholder="Color"
                        />
                        {errors.currentColor && (
                          <p className="text-sm text-red-500">{errors.currentColor.message}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Out Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateDueBack">Date Due Back</Label>
                    <Input
                      id="dateDueBack"
                      type="date"
                      {...register("dateDueBack")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileageOut">Mileage Out</Label>
                    <Input
                      id="mileageOut"
                      type="number"
                      {...register("mileageOut")}
                      placeholder="Miles"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelGaugeOut">Fuel Gauge (Out)</Label>
                    <Input
                      id="fuelGaugeOut"
                      {...register("fuelGaugeOut")}
                      placeholder="F/E/1/2 etc."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurance" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceCompany">Insurance Company *</Label>
                      <Input
                        id="insuranceCompany"
                        {...register("insuranceCompany")}
                        placeholder="Company name"
                      />
                      {errors.insuranceCompany && (
                        <p className="text-sm text-red-500">{errors.insuranceCompany.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyNumber">Policy # *</Label>
                      <Input
                        id="policyNumber"
                        {...register("policyNumber")}
                        placeholder="Policy number"
                      />
                      {errors.policyNumber && (
                        <p className="text-sm text-red-500">{errors.policyNumber.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyExpiration">Expiration *</Label>
                      <Input
                        id="policyExpiration"
                        type="date"
                        {...register("policyExpiration")}
                      />
                      {errors.policyExpiration && (
                        <p className="text-sm text-red-500">{errors.policyExpiration.message}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceAgent">Insurance Agent</Label>
                      <Input
                        id="insuranceAgent"
                        {...register("insuranceAgent")}
                        placeholder="Agent name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentPhone">Agent Phone</Label>
                      <Input
                        id="agentPhone"
                        {...register("agentPhone")}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adjuster">Adjuster</Label>
                      <Input
                        id="adjuster"
                        {...register("adjuster")}
                        placeholder="Adjuster name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjusterPhone">Adjuster Phone</Label>
                      <Input
                        id="adjusterPhone"
                        {...register("adjusterPhone")}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="claimNumber">Claim #</Label>
                      <Input
                        id="claimNumber"
                        {...register("claimNumber")}
                        placeholder="Claim number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfLoss">Date of Loss</Label>
                      <Input
                        id="dateOfLoss"
                        type="date"
                        {...register("dateOfLoss")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rates" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rates & Charges</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Minimum charge is one day (24 hours). Rates do not include gasoline.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposits">Deposits</Label>
                      <Input
                        id="deposits"
                        {...register("deposits")}
                        placeholder="Amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salesTax">Sales Tax (%)</Label>
                      <Input
                        id="salesTax"
                        {...register("salesTax")}
                        placeholder="8.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stateSalesTax">RI State Sales Tax (%)</Label>
                      <Input
                        id="stateSalesTax"
                        {...register("stateSalesTax")}
                        placeholder="7.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelCharges">Fuel Charges (/GAL)</Label>
                      <Input
                        id="fuelCharges"
                        {...register("fuelCharges")}
                        placeholder="5.99"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">Important Terms:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• NO SMOKING - $250 cleaning fee</li>
                      <li>• NO PETS - $250 cleaning fee (except service animals)</li>
                      <li>• REFILL GAS - Return with same fuel level</li>
                      <li>• Vehicles can be driven in RI, MA, and CT only</li>
                      <li>• Call 30 mins before returning rental vehicle</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between gap-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {activeTab !== "renter" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const tabs = ["renter", "vehicle", "insurance", "rates"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  Previous
                </Button>
              )}
              {activeTab !== "rates" ? (
                <Button
                  type="button"
                  onClick={() => {
                    const tabs = ["renter", "vehicle", "insurance", "rates"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit">Create Agreement</Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
