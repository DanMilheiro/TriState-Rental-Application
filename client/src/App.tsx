import React, { useState, useMemo } from "react";
import {
  Car,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Users
} from "lucide-react";
import { Link, useLocation, Switch, Route } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RentalAgreementForm } from "@/components/RentalAgreementForm";
import { VehicleEditDialog } from "@/components/VehicleEditDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit } from "lucide-react";


function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAgreementFormOpen, setIsAgreementFormOpen] = useState(false);

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/vehicles", icon: Car, label: "Vehicles" },
    { href: "/agreements", icon: FileText, label: "Agreements" },
  ];

  const queryClient = useQueryClient();

  const createAgreementMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create agreement");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agreements"] });
      toast.success("Rental agreement created successfully!");
    },
    onError: () => {
      toast.error("Failed to create agreement");
    },
  });

  const handleAgreementSubmit = (data: any) => {
    createAgreementMutation.mutate(data);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 glass-panel border-r flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <Car className="w-6 h-6" />
            TriState Auto
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                location === item.href
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary"
              }`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 glass-panel border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Welcome Back, Admin</h2>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsAgreementFormOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Agreement
          </Button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>

      <RentalAgreementForm
        open={isAgreementFormOpen}
        onOpenChange={setIsAgreementFormOpen}
        onSubmit={handleAgreementSubmit}
      />
    </div>
  );
}

function Dashboard() {
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);

  const { data: vehicles = [] } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      return response.json();
    },
  });

  const { data: agreements = [] } = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => {
      const response = await fetch("/api/agreements");
      if (!response.ok) throw new Error("Failed to fetch agreements");
      return response.json();
    },
  });

  const totalVehicles = vehicles.length;
  const loanedVehicles = vehicles.filter((v: any) => v.status === "Loaned").length;
  const loanedPercentage = totalVehicles > 0 ? Math.round((loanedVehicles / totalVehicles) * 100) : 0;

  const stats = [
    { label: "Total Vehicles", value: totalVehicles.toString(), icon: Car, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Currently Loaned", value: loanedVehicles.toString(), icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Active Agreements", value: agreements.filter((a: any) => a.status === "Active").length.toString(), icon: FileText, color: "text-green-600", bg: "bg-green-100" },
    { label: "Fleet Utilization", value: `${loanedPercentage}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none subtle-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none subtle-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agreements.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No agreements yet</p>
              ) : (
                agreements.slice(0, 3).map((agr: any) => (
                  <div
                    key={agr.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary/80 transition-colors cursor-pointer"
                    onClick={() => setSelectedAgreement(agr)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg subtle-shadow">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{agr.renter_name}</p>
                        <p className="text-sm text-muted-foreground">{agr.current_make} {agr.current_model} ({agr.current_year})</p>
                      </div>
                    </div>
                    <Badge variant={agr.status === "Active" ? "default" : "secondary"}>
                      {agr.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none subtle-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vehicle Quick Access</CardTitle>
            <Link href="/vehicles">
              <Button variant="link" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicles.slice(0, 4).map((car: any) => (
                <div key={car.id} className="flex items-center justify-between p-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{car.make} {car.model}</span>
                  </div>
                  <Badge className={car.status === "In-House" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none"}>
                    {car.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedAgreement} onOpenChange={() => setSelectedAgreement(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agreement Details - {selectedAgreement?.agreement_number}</DialogTitle>
          </DialogHeader>
          {selectedAgreement && (
            <div className="space-y-6">
              <div id="agreement-pdf-content" className="bg-white p-8 space-y-6">
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">TRI-STATE AUTO RENTAL LLC.</h2>
                  <p className="text-sm">718 COTTAGE STREET, PAWTUCKET, RI 02861</p>
                  <p className="text-sm">508-761-9700</p>
                  <p className="text-lg font-semibold mt-2">RENTAL AGREEMENT #{selectedAgreement.agreement_number}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Renter Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Name:</span> {selectedAgreement.renter_name}</p>
                      <p><span className="font-semibold">Address:</span> {selectedAgreement.renter_address}</p>
                      <p><span className="font-semibold">City, State ZIP:</span> {selectedAgreement.renter_city}, {selectedAgreement.renter_state} {selectedAgreement.renter_zip_code}</p>
                      <p><span className="font-semibold">Phone:</span> {selectedAgreement.renter_phone}</p>
                      <p><span className="font-semibold">Email:</span> {selectedAgreement.renter_email}</p>
                      <p><span className="font-semibold">Date of Birth:</span> {new Date(selectedAgreement.date_of_birth).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Driver's License:</span> {selectedAgreement.drivers_license} ({selectedAgreement.license_state})</p>
                      <p><span className="font-semibold">License Exp:</span> {new Date(selectedAgreement.license_expiration).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Insurance Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Company:</span> {selectedAgreement.insurance_company}</p>
                      <p><span className="font-semibold">Policy #:</span> {selectedAgreement.policy_number}</p>
                      <p><span className="font-semibold">Expiration:</span> {new Date(selectedAgreement.policy_expiration).toLocaleDateString()}</p>
                      {selectedAgreement.insurance_agent && <p><span className="font-semibold">Agent:</span> {selectedAgreement.insurance_agent}</p>}
                      {selectedAgreement.agent_phone && <p><span className="font-semibold">Agent Phone:</span> {selectedAgreement.agent_phone}</p>}
                      {selectedAgreement.adjuster && <p><span className="font-semibold">Adjuster:</span> {selectedAgreement.adjuster}</p>}
                      {selectedAgreement.adjuster_phone && <p><span className="font-semibold">Adjuster Phone:</span> {selectedAgreement.adjuster_phone}</p>}
                      {selectedAgreement.claim_number && <p><span className="font-semibold">Claim #:</span> {selectedAgreement.claim_number}</p>}
                      {selectedAgreement.date_of_loss && <p><span className="font-semibold">Date of Loss:</span> {new Date(selectedAgreement.date_of_loss).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {(selectedAgreement.original_car_number || selectedAgreement.original_make) && (
                    <div>
                      <h3 className="font-bold text-lg mb-3 border-b pb-2">Original Vehicle</h3>
                      <div className="space-y-2 text-sm">
                        {selectedAgreement.original_car_number && <p><span className="font-semibold">VIN:</span> {selectedAgreement.original_car_number}</p>}
                        {selectedAgreement.original_license && <p><span className="font-semibold">License:</span> {selectedAgreement.original_license}</p>}
                        {selectedAgreement.original_year && <p><span className="font-semibold">Year:</span> {selectedAgreement.original_year}</p>}
                        {selectedAgreement.original_make && <p><span className="font-semibold">Make/Model:</span> {selectedAgreement.original_make} {selectedAgreement.original_model}</p>}
                        {selectedAgreement.original_color && <p><span className="font-semibold">Color:</span> {selectedAgreement.original_color}</p>}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Rental Vehicle</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">VIN:</span> {selectedAgreement.current_car_number}</p>
                      <p><span className="font-semibold">License:</span> {selectedAgreement.current_license}</p>
                      <p><span className="font-semibold">Year:</span> {selectedAgreement.current_year}</p>
                      <p><span className="font-semibold">Make/Model:</span> {selectedAgreement.current_make} {selectedAgreement.current_model}</p>
                      <p><span className="font-semibold">Color:</span> {selectedAgreement.current_color}</p>
                      {selectedAgreement.date_due_back && <p><span className="font-semibold">Due Back:</span> {new Date(selectedAgreement.date_due_back).toLocaleDateString()}</p>}
                      {selectedAgreement.mileage_out && <p><span className="font-semibold">Mileage Out:</span> {selectedAgreement.mileage_out}</p>}
                      {selectedAgreement.fuel_gauge_out && <p><span className="font-semibold">Fuel Out:</span> {selectedAgreement.fuel_gauge_out}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 border-b pb-2">Terms & Conditions</h3>
                  <div className="space-y-2 text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>NO SMOKING - $250 cleaning fee</li>
                      <li>NO PETS - $250 cleaning fee (except service animals)</li>
                      <li>REFILL GAS - Return with same fuel level</li>
                      <li>Vehicles can be driven in RI, MA, and CT only</li>
                      <li>Call 30 mins before returning rental vehicle</li>
                      <li>Minimum charge is one day (24 hours). Rates do not include gasoline.</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <p><span className="font-semibold">Sales Tax:</span> {selectedAgreement.sales_tax}%</p>
                      <p><span className="font-semibold">RI State Sales Tax:</span> {selectedAgreement.state_sales_tax}%</p>
                      <p><span className="font-semibold">Fuel Charges:</span> ${selectedAgreement.fuel_charges}/GAL</p>
                      {selectedAgreement.deposits && <p><span className="font-semibold">Deposits:</span> ${selectedAgreement.deposits}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">Agreement created: {new Date(selectedAgreement.created_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Status: {selectedAgreement.status}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <Button variant="outline" onClick={() => setSelectedAgreement(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  const content = document.getElementById('agreement-pdf-content');
                  if (content) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Rental Agreement ${selectedAgreement.agreement_number}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              h2, h3 { margin-top: 0; }
                              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                              @media print { body { padding: 0; } }
                            </style>
                          </head>
                          <body>${content.innerHTML}</body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Print Agreement
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Vehicles() {
  const [search, setSearch] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<any | null>(null);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");

  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await fetch("/api/vehicles");
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      return response.json();
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create vehicle");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle added successfully!");
    },
    onError: () => {
      toast.error("Failed to add vehicle");
    },
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/vehicles/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update vehicle");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update vehicle");
    },
  });

  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete vehicle");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully!");
      setVehicleToDelete(null);
    },
    onError: () => {
      toast.error("Failed to delete vehicle");
    },
  });

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setEditMode("add");
    setIsEditDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setEditMode("edit");
    setIsEditDialogOpen(true);
  };

  const handleSaveVehicle = (data: any) => {
    if (editMode === "edit") {
      updateVehicleMutation.mutate(data);
    } else {
      createVehicleMutation.mutate(data);
    }
  };

  const handleDeleteVehicle = () => {
    if (vehicleToDelete) {
      deleteVehicleMutation.mutate(vehicleToDelete.id);
    }
  };

  const filteredVehicles = vehicles.filter((v: any) =>
    v.make.toLowerCase().includes(search.toLowerCase()) ||
    v.model.toLowerCase().includes(search.toLowerCase()) ||
    v.plate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Fleet Manager</h1>
          <p className="text-muted-foreground">Manage your rental inventory and vehicle status.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              className="pl-10 glass-panel"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="gap-2" onClick={handleAddVehicle}>
            <Plus className="w-4 h-4" /> Add Vehicle
          </Button>
        </div>
      </div>

      <Card className="border-none subtle-shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading vehicles...</div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead className="w-[100px]">Year</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>License Plate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground p-8">
                    No vehicles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVehicles.map((car: any) => (
                  <TableRow key={car.id} className="hover:bg-secondary/20 transition-colors">
                    <TableCell className="font-medium">{car.year}</TableCell>
                    <TableCell className="font-semibold">{car.make} {car.model}</TableCell>
                    <TableCell>{car.type}</TableCell>
                    <TableCell><code className="bg-secondary px-2 py-1 rounded text-xs font-mono">{car.plate}</code></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          car.status === "In-House" ? "bg-green-500" :
                          car.status === "Loaned" ? "bg-orange-500" :
                          "bg-yellow-500"
                        }`} />
                        <span className="text-sm font-medium">{car.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVehicle(car)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVehicleToDelete(car)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      <VehicleEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
        mode={editMode}
      />

      <AlertDialog open={!!vehicleToDelete} onOpenChange={() => setVehicleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {vehicleToDelete?.make} {vehicleToDelete?.model} ({vehicleToDelete?.plate})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVehicle}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Agreements() {
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);

  const { data: agreements = [], isLoading } = useQuery({
    queryKey: ["agreements"],
    queryFn: async () => {
      const response = await fetch("/api/agreements");
      if (!response.ok) throw new Error("Failed to fetch agreements");
      return response.json();
    },
  });

  const handlePrintPDF = (agr: any) => {
    setSelectedAgreement(agr);
    setTimeout(() => {
      const content = document.getElementById('agreement-pdf-content');
      if (content) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Rental Agreement ${agr.agreement_number}</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h2, h3 { margin-top: 0; }
                  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                  @media print { body { padding: 0; } }
                </style>
              </head>
              <body>${content.innerHTML}</body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    }, 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold">Rental Agreements</h1>
        <p className="text-muted-foreground">Draft, manage, and print customer rental contracts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none subtle-shadow">
            <CardHeader>
              <CardTitle>All Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading agreements...</p>
              ) : agreements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No agreements yet. Create your first rental agreement to get started.</p>
              ) : (
                <div className="space-y-4">
                  {agreements.map((agr: any) => (
                    <div key={agr.id} className="flex items-center justify-between p-6 rounded-2xl border bg-white hover:shadow-md transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg">{agr.renter_name}</h4>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{agr.agreement_number}</Badge>
                          </div>
                          <p className="text-muted-foreground flex items-center gap-2 text-sm">
                            <Car className="w-3 h-3" /> {agr.current_make} {agr.current_model} ({agr.current_year}) • Created {new Date(agr.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={() => handlePrintPDF(agr)}>Print PDF</Button>
                        <Button size="sm" onClick={() => setSelectedAgreement(agr)}>Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-white border-none subtle-shadow shadow-primary/20">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <p className="text-primary-foreground/80 text-sm">Current rental agreement overview</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/10 rounded-lg text-center">
                  <p className="text-xs text-primary-foreground/60 uppercase font-bold">Total</p>
                  <p className="text-xl font-bold">{agreements.length}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg text-center">
                  <p className="text-xs text-primary-foreground/60 uppercase font-bold">Active</p>
                  <p className="text-xl font-bold">{agreements.filter((a: any) => a.status === "Active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedAgreement} onOpenChange={() => setSelectedAgreement(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agreement Details - {selectedAgreement?.agreement_number}</DialogTitle>
          </DialogHeader>
          {selectedAgreement && (
            <div className="space-y-6">
              <div id="agreement-pdf-content" className="bg-white p-8 space-y-6">
                <div className="text-center border-b pb-4">
                  <h2 className="text-2xl font-bold">TRI-STATE AUTO RENTAL LLC.</h2>
                  <p className="text-sm">718 COTTAGE STREET, PAWTUCKET, RI 02861</p>
                  <p className="text-sm">508-761-9700</p>
                  <p className="text-lg font-semibold mt-2">RENTAL AGREEMENT #{selectedAgreement.agreement_number}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Renter Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Name:</span> {selectedAgreement.renter_name}</p>
                      <p><span className="font-semibold">Address:</span> {selectedAgreement.renter_address}</p>
                      <p><span className="font-semibold">City, State ZIP:</span> {selectedAgreement.renter_city}, {selectedAgreement.renter_state} {selectedAgreement.renter_zip_code}</p>
                      <p><span className="font-semibold">Phone:</span> {selectedAgreement.renter_phone}</p>
                      <p><span className="font-semibold">Email:</span> {selectedAgreement.renter_email}</p>
                      <p><span className="font-semibold">Date of Birth:</span> {new Date(selectedAgreement.date_of_birth).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Driver's License:</span> {selectedAgreement.drivers_license} ({selectedAgreement.license_state})</p>
                      <p><span className="font-semibold">License Exp:</span> {new Date(selectedAgreement.license_expiration).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Insurance Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Company:</span> {selectedAgreement.insurance_company}</p>
                      <p><span className="font-semibold">Policy #:</span> {selectedAgreement.policy_number}</p>
                      <p><span className="font-semibold">Expiration:</span> {new Date(selectedAgreement.policy_expiration).toLocaleDateString()}</p>
                      {selectedAgreement.insurance_agent && <p><span className="font-semibold">Agent:</span> {selectedAgreement.insurance_agent}</p>}
                      {selectedAgreement.agent_phone && <p><span className="font-semibold">Agent Phone:</span> {selectedAgreement.agent_phone}</p>}
                      {selectedAgreement.adjuster && <p><span className="font-semibold">Adjuster:</span> {selectedAgreement.adjuster}</p>}
                      {selectedAgreement.adjuster_phone && <p><span className="font-semibold">Adjuster Phone:</span> {selectedAgreement.adjuster_phone}</p>}
                      {selectedAgreement.claim_number && <p><span className="font-semibold">Claim #:</span> {selectedAgreement.claim_number}</p>}
                      {selectedAgreement.date_of_loss && <p><span className="font-semibold">Date of Loss:</span> {new Date(selectedAgreement.date_of_loss).toLocaleDateString()}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {(selectedAgreement.original_car_number || selectedAgreement.original_make) && (
                    <div>
                      <h3 className="font-bold text-lg mb-3 border-b pb-2">Original Vehicle</h3>
                      <div className="space-y-2 text-sm">
                        {selectedAgreement.original_car_number && <p><span className="font-semibold">VIN:</span> {selectedAgreement.original_car_number}</p>}
                        {selectedAgreement.original_license && <p><span className="font-semibold">License:</span> {selectedAgreement.original_license}</p>}
                        {selectedAgreement.original_year && <p><span className="font-semibold">Year:</span> {selectedAgreement.original_year}</p>}
                        {selectedAgreement.original_make && <p><span className="font-semibold">Make/Model:</span> {selectedAgreement.original_make} {selectedAgreement.original_model}</p>}
                        {selectedAgreement.original_color && <p><span className="font-semibold">Color:</span> {selectedAgreement.original_color}</p>}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-lg mb-3 border-b pb-2">Rental Vehicle</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">VIN:</span> {selectedAgreement.current_car_number}</p>
                      <p><span className="font-semibold">License:</span> {selectedAgreement.current_license}</p>
                      <p><span className="font-semibold">Year:</span> {selectedAgreement.current_year}</p>
                      <p><span className="font-semibold">Make/Model:</span> {selectedAgreement.current_make} {selectedAgreement.current_model}</p>
                      <p><span className="font-semibold">Color:</span> {selectedAgreement.current_color}</p>
                      {selectedAgreement.date_due_back && <p><span className="font-semibold">Due Back:</span> {new Date(selectedAgreement.date_due_back).toLocaleDateString()}</p>}
                      {selectedAgreement.mileage_out && <p><span className="font-semibold">Mileage Out:</span> {selectedAgreement.mileage_out}</p>}
                      {selectedAgreement.fuel_gauge_out && <p><span className="font-semibold">Fuel Out:</span> {selectedAgreement.fuel_gauge_out}</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3 border-b pb-2">Terms & Conditions</h3>
                  <div className="space-y-2 text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>NO SMOKING - $250 cleaning fee</li>
                      <li>NO PETS - $250 cleaning fee (except service animals)</li>
                      <li>REFILL GAS - Return with same fuel level</li>
                      <li>Vehicles can be driven in RI, MA, and CT only</li>
                      <li>Call 30 mins before returning rental vehicle</li>
                      <li>Minimum charge is one day (24 hours). Rates do not include gasoline.</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t">
                      <p><span className="font-semibold">Sales Tax:</span> {selectedAgreement.sales_tax}%</p>
                      <p><span className="font-semibold">RI State Sales Tax:</span> {selectedAgreement.state_sales_tax}%</p>
                      <p><span className="font-semibold">Fuel Charges:</span> ${selectedAgreement.fuel_charges}/GAL</p>
                      {selectedAgreement.deposits && <p><span className="font-semibold">Deposits:</span> ${selectedAgreement.deposits}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">Agreement created: {new Date(selectedAgreement.created_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Status: {selectedAgreement.status}</p>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <Button variant="outline" onClick={() => setSelectedAgreement(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  const content = document.getElementById('agreement-pdf-content');
                  if (content) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Rental Agreement ${selectedAgreement.agreement_number}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              h2, h3 { margin-top: 0; }
                              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                              @media print { body { padding: 0; } }
                            </style>
                          </head>
                          <body>${content.innerHTML}</body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }
                }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Print Agreement
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function App() {
  return (
    <Switch>
      <Route path="/">
        <Layout><Dashboard /></Layout>
      </Route>
      <Route path="/vehicles">
        <Layout><Vehicles /></Layout>
      </Route>
      <Route path="/agreements">
        <Layout><Agreements /></Layout>
      </Route>
      <Route>
        <div className="flex items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold">404 - Not Found</h1>
        </div>
      </Route>
    </Switch>
  );
}