import React, { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useRestaurantContext } from "../context/RestaurantContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const TablesStaffManagement: React.FC = () => {
  const {
    currentRestaurant,
    tables,
    addTable,
    updateTable,
    deleteTable,
    staff,
    addStaff,
    updateStaff,
    deleteStaff,
  } = useRestaurantContext();

  // Dialog states
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [staffDialogOpen, setStaffDialogOpen] = useState(false);
  
  // Form states
  const [tableForm, setTableForm] = useState({
    id: "",
    name: "",
    seats: 2,
    isAvailable: true,
  });
  
  const [staffForm, setStaffForm] = useState({
    id: "",
    name: "",
    role: "",
    email: "",
  });
  
  // Edit flags
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [isEditingStaff, setIsEditingStaff] = useState(false);

  // Current restaurant's tables and staff
  const restaurantTables = tables.filter(
    table => table.restaurantId === currentRestaurant?.id
  );
  
  const restaurantStaff = staff.filter(
    staffMember => staffMember.restaurantId === currentRestaurant?.id
  );

  // Reset forms
  const resetTableForm = () => {
    setTableForm({
      id: "",
      name: "",
      seats: 2,
      isAvailable: true,
    });
    setIsEditingTable(false);
  };
  
  const resetStaffForm = () => {
    setStaffForm({
      id: "",
      name: "",
      role: "",
      email: "",
    });
    setIsEditingStaff(false);
  };
  
  // Handle edit functions
  const handleEditTable = (table: any) => {
    setTableForm({
      id: table.id,
      name: table.name,
      seats: table.seats,
      isAvailable: table.isAvailable,
    });
    setIsEditingTable(true);
    setTableDialogOpen(true);
  };
  
  const handleEditStaff = (staffMember: any) => {
    setStaffForm({
      id: staffMember.id,
      name: staffMember.name,
      role: staffMember.role,
      email: staffMember.email,
    });
    setIsEditingStaff(true);
    setStaffDialogOpen(true);
  };
  
  // Handle submit functions
  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tableForm.name || tableForm.seats <= 0) {
      toast({
        title: "Error",
        description: "Table name and seats are required",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditingTable) {
      updateTable(tableForm.id, {
        name: tableForm.name,
        seats: tableForm.seats,
        isAvailable: tableForm.isAvailable,
      });
      toast({
        title: "Success",
        description: "Table updated successfully"
      });
    } else {
      if (!currentRestaurant) return;
      
      addTable({
        name: tableForm.name,
        seats: tableForm.seats,
        isAvailable: tableForm.isAvailable,
        restaurantId: currentRestaurant.id,
      });
      toast({
        title: "Success",
        description: "Table added successfully"
      });
    }
    
    resetTableForm();
    setTableDialogOpen(false);
  };
  
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!staffForm.name || !staffForm.role || !staffForm.email) {
      toast({
        title: "Error",
        description: "Name, role and email are required",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditingStaff) {
      updateStaff(staffForm.id, {
        name: staffForm.name,
        role: staffForm.role,
        email: staffForm.email,
      });
      toast({
        title: "Success",
        description: "Staff member updated successfully"
      });
    } else {
      if (!currentRestaurant) return;
      
      addStaff({
        name: staffForm.name,
        role: staffForm.role,
        email: staffForm.email,
        restaurantId: currentRestaurant.id,
      });
      toast({
        title: "Success",
        description: "Staff member added successfully"
      });
    }
    
    resetStaffForm();
    setStaffDialogOpen(false);
  };
  
  // Handle delete functions
  const handleDeleteTable = (tableId: string) => {
    if (confirm("Are you sure you want to delete this table?")) {
      deleteTable(tableId);
      toast({
        title: "Success",
        description: "Table deleted successfully"
      });
    }
  };
  
  const handleDeleteStaff = (staffId: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      deleteStaff(staffId);
      toast({
        title: "Success",
        description: "Staff member deleted successfully"
      });
    }
  };
  
  // Handle table availability toggle
  const handleToggleTableAvailability = (tableId: string, isAvailable: boolean) => {
    updateTable(tableId, { isAvailable });
  };

  return (
    <DashboardLayout title="Tables & Staff">
      <Tabs defaultValue="tables">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          <div>
            <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="mr-2">
                  <Plus size={16} className="mr-1" /> Add Table
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditingTable ? "Edit Table" : "Add Table"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingTable
                      ? "Update this table's details"
                      : "Add a new table to your restaurant"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleTableSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="tableName">Table Name</Label>
                      <Input
                        id="tableName"
                        value={tableForm.name}
                        onChange={(e) =>
                          setTableForm({ ...tableForm, name: e.target.value })
                        }
                        placeholder="e.g. Table 1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seats">Number of Seats</Label>
                      <Input
                        id="seats"
                        type="number"
                        min="1"
                        value={tableForm.seats}
                        onChange={(e) =>
                          setTableForm({
                            ...tableForm,
                            seats: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAvailable"
                        checked={tableForm.isAvailable}
                        onCheckedChange={(checked) =>
                          setTableForm({ ...tableForm, isAvailable: checked })
                        }
                      />
                      <Label htmlFor="isAvailable">Available for seating</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      resetTableForm();
                      setTableDialogOpen(false);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditingTable ? "Update" : "Add"} Table
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Dialog open={staffDialogOpen} onOpenChange={setStaffDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-1" /> Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditingStaff ? "Edit Staff Member" : "Add Staff Member"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditingStaff
                      ? "Update this staff member's details"
                      : "Add a new staff member to your restaurant"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleStaffSubmit}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="staffName">Full Name</Label>
                      <Input
                        id="staffName"
                        value={staffForm.name}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, name: e.target.value })
                        }
                        placeholder="e.g. John Smith"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={staffForm.role}
                        onValueChange={(value) =>
                          setStaffForm({ ...staffForm, role: value })
                        }
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chef">Chef</SelectItem>
                          <SelectItem value="Server">Server</SelectItem>
                          <SelectItem value="Host">Host</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Bartender">Bartender</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={staffForm.email}
                        onChange={(e) =>
                          setStaffForm({ ...staffForm, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => {
                      resetStaffForm();
                      setStaffDialogOpen(false);
                    }}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditingStaff ? "Update" : "Add"} Staff
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="tables" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Tables</CardTitle>
            </CardHeader>
            <CardContent>
              {restaurantTables.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">Table Name</th>
                        <th className="text-left p-4 font-medium">Seats</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantTables.map((table) => (
                        <tr key={table.id} className="border-b">
                          <td className="p-4 font-medium">{table.name}</td>
                          <td className="p-4">{table.seats}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`available-${table.id}`}
                                checked={table.isAvailable}
                                onCheckedChange={(checked) =>
                                  handleToggleTableAvailability(table.id, checked)
                                }
                              />
                              <Label htmlFor={`available-${table.id}`} className="text-sm">
                                {table.isAvailable ? "Available" : "Unavailable"}
                              </Label>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTable(table)}
                              className="mr-2"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTable(table.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No tables yet. Add a table to begin.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Staff</CardTitle>
            </CardHeader>
            <CardContent>
              {restaurantStaff.length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-4 font-medium">Name</th>
                        <th className="text-left p-4 font-medium">Role</th>
                        <th className="text-left p-4 font-medium">Email</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantStaff.map((staffMember) => (
                        <tr key={staffMember.id} className="border-b">
                          <td className="p-4 font-medium">{staffMember.name}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {staffMember.role}
                            </span>
                          </td>
                          <td className="p-4">{staffMember.email}</td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStaff(staffMember)}
                              className="mr-2"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStaff(staffMember.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No staff members yet. Add staff to begin.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default TablesStaffManagement;
