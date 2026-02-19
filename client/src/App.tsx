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

// Mock Data
const MOCK_VEHICLES = [
  { id: "1", make: "Toyota", model: "Camry", year: "2024", status: "In-House", plate: "ABC-1234", type: "Sedan" },
  { id: "2", make: "Honda", model: "Civic", year: "2023", status: "Loaned", plate: "XYZ-5678", type: "Sedan" },
  { id: "3", make: "Ford", model: "Explorer", year: "2024", status: "In-House", plate: "RST-9012", type: "SUV" },
  { id: "4", make: "Tesla", model: "Model 3", year: "2023", status: "Loaned", plate: "ELC-4321", type: "Electric" },
  { id: "5", make: "Jeep", model: "Grand Cherokee", year: "2024", status: "In-House", plate: "JEP-7788", type: "SUV" },
];

const MOCK_AGREEMENTS = [
  { id: "AGR-001", customer: "John Doe", vehicle: "Honda Civic (2023)", date: "2026-02-18", status: "Active" },
  { id: "AGR-002", customer: "Jane Smith", vehicle: "Tesla Model 3 (2023)", date: "2026-02-19", status: "Active" },
  { id: "AGR-003", customer: "Robert Wilson", vehicle: "Toyota Camry (2024)", date: "2026-02-15", status: "Completed" },
];

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/vehicles", icon: Car, label: "Vehicles" },
    { href: "/agreements", icon: FileText, label: "Agreements" },
  ];

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
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Agreement
          </Button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const stats = [
    { label: "Total Vehicles", value: "24", icon: Car, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Currently Loaned", value: "8", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Active Agreements", value: "12", icon: FileText, color: "text-green-600", bg: "bg-green-100" },
    { label: "Monthly Growth", value: "+12%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
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
              {MOCK_AGREEMENTS.map((agr) => (
                <div key={agr.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg subtle-shadow">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{agr.customer}</p>
                      <p className="text-sm text-muted-foreground">{agr.vehicle}</p>
                    </div>
                  </div>
                  <Badge variant={agr.status === "Active" ? "default" : "secondary"}>
                    {agr.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none subtle-shadow">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Vehicle Quick Access</CardTitle>
            <Button variant="link" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_VEHICLES.slice(0, 4).map((car) => (
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
    </div>
  );
}

function Vehicles() {
  const [search, setSearch] = useState("");

  const filteredVehicles = MOCK_VEHICLES.filter(v => 
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
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Vehicle
          </Button>
        </div>
      </div>

      <Card className="border-none subtle-shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead className="w-[100px]">Year</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>License Plate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((car) => (
              <TableRow key={car.id} className="hover:bg-secondary/20 transition-colors">
                <TableCell className="font-medium">{car.year}</TableCell>
                <TableCell className="font-semibold">{car.make} {car.model}</TableCell>
                <TableCell>{car.type}</TableCell>
                <TableCell><code className="bg-secondary px-2 py-1 rounded text-xs font-mono">{car.plate}</code></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${car.status === "In-House" ? "bg-green-500" : "bg-orange-500"}`} />
                    <span className="text-sm font-medium">{car.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function Agreements() {
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
              <CardTitle>Active Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_AGREEMENTS.map((agr) => (
                  <div key={agr.id} className="flex items-center justify-between p-6 rounded-2xl border bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg">{agr.customer}</h4>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{agr.id}</Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                          <Car className="w-3 h-3" /> {agr.vehicle} • Started {agr.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">Print PDF</Button>
                      <Button size="sm">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-white border-none subtle-shadow shadow-primary/20">
            <CardHeader>
              <CardTitle>New Agreement</CardTitle>
              <p className="text-primary-foreground/80 text-sm">Quickly generate a new rental contract for a waiting customer.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold py-6 text-lg rounded-xl shadow-xl">
                Start Contract
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/10 rounded-lg text-center">
                  <p className="text-xs text-primary-foreground/60 uppercase font-bold">Pending</p>
                  <p className="text-xl font-bold">3</p>
                </div>
                <div className="p-3 bg-white/10 rounded-lg text-center">
                  <p className="text-xs text-primary-foreground/60 uppercase font-bold">Due Today</p>
                  <p className="text-xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none subtle-shadow bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-sm">Agreement Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 bg-white rounded-lg text-sm font-medium border cursor-pointer hover:border-primary transition-colors flex items-center justify-between">
                Standard Rental
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="p-3 bg-white rounded-lg text-sm font-medium border cursor-pointer hover:border-primary transition-colors flex items-center justify-between">
                Insurance Loaner
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="p-3 bg-white rounded-lg text-sm font-medium border cursor-pointer hover:border-primary transition-colors flex items-center justify-between">
                Service Replacement
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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