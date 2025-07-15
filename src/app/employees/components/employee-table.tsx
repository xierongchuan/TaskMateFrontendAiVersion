"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const employees = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Manager", status: "Active", schedule: "Mon-Fri 9am-5pm" },
    { id: 2, name: "Bob Williams", email: "bob@example.com", role: "Developer", status: "Active", schedule: "Mon-Fri 10am-6pm" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Designer", status: "On Leave", schedule: "Tue-Sat 8am-4pm" },
    { id: 4, name: "Diana Miller", email: "diana@example.com", role: "Developer", status: "Active", schedule: "Mon-Fri 9am-5pm" },
    { id: 5, name: "Ethan Davis", email: "ethan@example.com", role: "QA Tester", status: "Terminated", schedule: "Mon-Fri 9am-5pm" },
    { id: 6, name: "Fiona Garcia", email: "fiona@example.com", role: "Developer", status: "Active", schedule: "Flexible" },
];

export default function EmployeeTable() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredEmployees = useMemo(() => {
        return employees.filter(employee => {
            const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  employee.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);
    
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`;
        }
        return names[0].substring(0, 2);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Employee List</CardTitle>
                <div className="mt-4 flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="On Leave">On Leave</SelectItem>
                            <SelectItem value="Terminated">Terminated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead className="hidden md:table-cell">Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden sm:table-cell">Schedule</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person portrait" />
                                                    <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{employee.name}</div>
                                                    <div className="text-sm text-muted-foreground">{employee.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{employee.role}</TableCell>
                                        <TableCell>
                                            <Badge variant={employee.status === 'Active' ? 'default' : employee.status === 'On Leave' ? 'secondary' : 'destructive'}>
                                                {employee.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{employee.schedule}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No employees found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
