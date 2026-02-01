import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

export function ScholarshipRoutesWithModals() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Detect modal routes based on pathname
    const pathname = location.pathname;
    // const isCreateModal = /\/scholarship\/create\/?$/.test(pathname);
    // const isEditModal = /\/scholarship\/[^/]+\/edit\/?$/.test(pathname);
    // const isViewModal = /\/scholarship\/[^/]+\/?$/.test(pathname) && !isEditModal && !isCreateModal;
    
    // Extract sch_code from pathname
    const schCodeMatch = pathname.match(/\/scholarship\/([^/]+)/);
    const sch_code = schCodeMatch ? schCodeMatch[1] : undefined;
    
    // const handleCloseView = () => {
    //     navigate('/scholarship');
    // };
    
    const handleCloseEdit = () => {
        if (sch_code) {
            navigate(-1);
        } else {
            navigate('/scholarship');
        }
    };
    
    return (
        <>
            <Routes>
                <Route index element={<Scholarship/>} />
                <Route path="all" element={
                    <TabsContent value="all">
                        <Scholarship />
                    </TabsContent>
                } />
                <Route path="create" element={<ScholarshipCreate/>} />
                <Route path=":sch_code" element={<ScholarshipView sch_code={sch_code} />} />
                <Route path=":sch_code/edit" element={<ScholarshipEdit sch_code={sch_code} onSuccess={() => handleCloseEdit()} />} />
            </Routes>
            
            {/* <Dialog open={isCreateModal} onOpenChange={(open) => !open && handleCloseCreate()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <ScholarshipCreate/>
                </DialogContent>
            </Dialog> */}
            
            {/* <Dialog open={isViewModal} onOpenChange={(open) => !open && handleCloseView()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <ScholarshipView sch_code={sch_code} />
                </DialogContent>
            </Dialog>
            
            <Dialog open={isEditModal} onOpenChange={(open) => !open && handleCloseEdit()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <ScholarshipEdit sch_code={sch_code} onSuccess={() => handleCloseEdit()} />
                </DialogContent>
            </Dialog> */}
        </>
    );
}

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

type APIScholarship = {
    sch_code: string;
    email: string;
    paper: string;
    discount: number;
    diet_name: string;
    createdAt?: string;
};

export function Scholarship() {
    const [scholarships, setScholarships] = useState<APIScholarship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        api.get("/scholarships")
            .then((res) => {
                if (!cancelled) {
                    setScholarships(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                setError("Failed to fetch scholarships.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; }
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Scholarships</h1>
                <Button onClick={() => navigate("/scholarship/create")}>Create Scholarship</Button>
            </div>
            {loading && <div className="py-12 text-center">Loading...</div>}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {!loading && scholarships.length === 0 && <div className="py-12 text-center text-gray-500">No scholarships found.</div>}
            {!loading && scholarships.length > 0 && (
                <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900 p-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Paper</TableHead>
                                <TableHead>Diet</TableHead>
                                <TableHead>Discount (%)</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scholarships.map((sch) => (
                                <TableRow key={sch.sch_code + sch.email + sch.paper + sch.diet_name}>
                                    <TableCell>{sch.email}</TableCell>
                                    <TableCell>{sch.paper}</TableCell>
                                    <TableCell>{sch.diet_name}</TableCell>
                                    <TableCell>{sch.discount}</TableCell>
                                    <TableCell>{sch.createdAt ? new Date(sch.createdAt).toLocaleDateString() : ""}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="secondary" size="sm" onClick={() => navigate(`/scholarship/${sch.paper}`)}>
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/scholarship/${sch.paper}/edit`)}>
                                                Edit
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

export const ScholarshipCreate = () => {
    const [form, setForm] = useState({
        scholarships: [
            {
                paper: "",
                discount: "",
                diet_name: "",
            }
        ]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [criteria, setCriteria] = useState<"reg_no" | "name">("reg_no");
    const [searchInput, setSearchInput] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<{
        blocked: boolean;
        email: string;
        firstname: string;
        lastname: string;
        profile_pic: string;
        reg_no: string;
        title: string;
    }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<{
        blocked: boolean;
        email: string;
        firstname: string;
        lastname: string;
        profile_pic: string;
        reg_no: string;
        title: string;
    } | null>(null);

    const handleScholarshipChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedScholarships = [...form.scholarships];
        updatedScholarships[index] = {
            ...updatedScholarships[index],
            [e.target.name]: e.target.value,
        };
        setForm({
            ...form,
            scholarships: updatedScholarships,
        });
    };

    const addScholarship = () => {
        setForm({
            ...form,
            scholarships: [
                ...form.scholarships,
                { paper: "", discount: "", diet_name: "" }
            ]
        });
    };

    const removeScholarship = (index: number) => {
        const updatedScholarships = form.scholarships.filter((_, i) => i !== index);
        setForm({
            ...form,
            scholarships: updatedScholarships,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedStudent) {
            setError("Please select a student before creating the scholarship.");
            setLoading(false);
            return;
        }

        // Format scholarships for request
        const scholarshipsPayload = form.scholarships.map(s => ({
            paper: s.paper,
            discount: Number(s.discount),
            diet_name: s.diet_name,
        }));

        try {
            await api.post("/award-scholarship", {
                email: selectedStudent.email,
                scholarships: scholarshipsPayload,
            });
            navigate("/scholarship");
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Failed to create scholarship. Please try again.");
            } else {
                setError("Failed to create scholarship. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        setSearching(true);
        setError(null);
        try {
            const response = await api.get("/find-student", {
                params: {
                    criteria,
                    string: searchInput.trim()
                }
            });
            const data = Array.isArray(response.data) ? response.data : [];
            setSearchResults(data);
            setSelectedStudent(null);

            if (data.length === 0) {
                setError("No student found.");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Failed to find student.");
            } else {
                setError("Failed to find student.");
            }
        } finally {
            setSearching(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Scholarship</h1>
                    <p className="text-muted-foreground">
                        Enter scholarship information below
                    </p>
                </div>
            </div>

            <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Find Student</h2>
                </div>
                <div className="grid gap-3 md:grid-cols-[200px_1fr_auto] md:items-end">
                    <div className="space-y-2">
                        <Label>Search By</Label>
                        <Select value={criteria} onValueChange={(value) => setCriteria(value as "reg_no" | "name")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select criteria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="reg_no">Registration Number</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="student-search">Search</Label>
                        <Input
                            id="student-search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={criteria === "reg_no" ? "e.g. ACC-2025-004" : "e.g. Kemi Ogunleye"}
                        />
                    </div>
                    <Button type="button" onClick={handleSearch} disabled={searching}>
                        {searching ? "Searching..." : "Search"}
                    </Button>
                </div>
                {selectedStudent && (
                    <div className="rounded-lg border bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Selected: {selectedStudent.title} {selectedStudent.firstname} {selectedStudent.lastname} • {selectedStudent.reg_no}
                    </div>
                )}
                {error && (
                    <div className="text-sm text-red-600">{error}</div>
                )}
                {searchResults.length > 0 && (
                    <div className="space-y-2">
                        <Label>Results</Label>
                        <div className="space-y-2">
                            {searchResults.map((student) => (
                                <button
                                    type="button"
                                    key={student.reg_no}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                                        selectedStudent?.reg_no === student.reg_no
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-gray-200 hover:border-cyan-300"
                                    }`}
                                >
                                    <div className="font-medium">
                                        {student.title} {student.firstname} {student.lastname}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {student.reg_no} • {student.email}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Scholarships</h2>
                {form.scholarships.map((scholarship, idx) => (
                    <div key={idx} className="mb-4 space-y-2 border p-4 rounded">
                        <div className="space-y-2">
                            <Label htmlFor={`paper-${idx}`}>Paper</Label>
                            <Input
                                id={`paper-${idx}`}
                                name="paper"
                                value={scholarship.paper}
                                onChange={(e) => handleScholarshipChange(idx, e)}
                                placeholder="e.g. FA"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`discount-${idx}`}>Discount</Label>
                            <Input
                                id={`discount-${idx}`}
                                name="discount"
                                type="number"
                                min="0"
                                max="100"
                                value={scholarship.discount}
                                onChange={(e) => handleScholarshipChange(idx, e)}
                                placeholder="e.g. 15"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`diet_name-${idx}`}>Diet Name</Label>
                            <Input
                                id={`diet_name-${idx}`}
                                name="diet_name"
                                value={scholarship.diet_name}
                                onChange={(e) => handleScholarshipChange(idx, e)}
                                placeholder="e.g. 2025_December"
                                required
                            />
                        </div>
                        {form.scholarships.length > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => removeScholarship(idx)}
                                className="mt-2"
                            >
                                Remove
                            </Button>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addScholarship}>Add Scholarship</Button>
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Scholarship"}
            </Button>
        </form>
    );
};

type APIScholarshipFull = {
    sch_code: string;
    email: string;
    paper: string;
    discount: number;
    diet_name: string;
    createdAt?: string;
};

type ScholarshipViewProps = {
    sch_code?: string;
};

export const ScholarshipView: React.FC<ScholarshipViewProps> = ({ sch_code }) => {
    const [scholarship, setScholarship] = useState<APIScholarshipFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sch_code) {
            setError("Invalid scholarship code.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        api.get("/scholarships")
            .then((res) => {
                const found = Array.isArray(res.data) ? res.data.find((s: APIScholarshipFull) => s.paper === sch_code) : null;
                if (found) {
                    setScholarship(found);
                } else {
                    setError("Scholarship not found.");
                }
            })
            .catch(() => setError("Failed to fetch scholarship."))
            .finally(() => setLoading(false));
    }, [sch_code]);

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!scholarship) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Scholarship Details</h2>
            <div>
                <strong>Email:</strong> {scholarship.email}
            </div>
            <div>
                <strong>Paper:</strong> {scholarship.paper}
            </div>
            <div>
                <strong>Diet:</strong> {scholarship.diet_name}
            </div>
            <div>
                <strong>Discount:</strong> {scholarship.discount}%
            </div>
            <div>
                <strong>Created At:</strong> {scholarship.createdAt ? new Date(scholarship.createdAt).toLocaleString() : "--"}
            </div>
        </div>
    );
};

type ScholarshipEditProps = {
    sch_code?: string;
    onSuccess?: () => void;
};

export const ScholarshipEdit: React.FC<ScholarshipEditProps> = ({ sch_code, onSuccess }) => {
    const [form, setForm] = useState({
        email: "",
        paper: "",
        discount: "",
        diet_name: ""
    });
    const [criteria, setCriteria] = useState<"reg_no" | "name">("reg_no");
    const [searchInput, setSearchInput] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<{
        blocked: boolean;
        email: string;
        firstname: string;
        lastname: string;
        profile_pic: string;
        reg_no: string;
        title: string;
    }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<{
        blocked: boolean;
        email: string;
        firstname: string;
        lastname: string;
        profile_pic: string;
        reg_no: string;
        title: string;
    } | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sch_code) {
            setError("Invalid scholarship code.");
            setFetching(false);
            return;
        }
        setFetching(true);
        setError(null);
        api.get("/scholarships")
            .then((res) => {
                const found = Array.isArray(res.data) ? res.data.find((s: APIScholarshipFull) => s.paper === sch_code) : null;
                if (found) {
                    setForm({
                        email: found.email,
                        paper: found.paper,
                        discount: found.discount.toString(),
                        diet_name: found.diet_name
                    });
                    setId(found.id);
                } else {
                    setError("Scholarship not found.");
                }
            })
            .catch(() => setError("Failed to fetch scholarship."))
            .finally(() => setFetching(false));
    }, [sch_code]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async () => {
        if (!searchInput.trim()) return;
        setSearching(true);
        setError(null);
        try {
            const response = await api.get("/find-student", {
                params: {
                    criteria,
                    string: searchInput.trim()
                }
            });
            const data = Array.isArray(response.data) ? response.data : [];
            setSearchResults(data);
            setSelectedStudent(null);
            if (data.length === 0) {
                setError("No student found.");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Failed to find student.");
            } else {
                setError("Failed to find student.");
            }
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (!id) {
            setError("Invalid scholarship ID.");
            setLoading(false);
            return;
        }
        api.patch(`/edit-scholarship`, {
            id: id,
            email: selectedStudent?.email ?? form.email,
            paper: form.paper,
            discount: Number(form.discount),
            diet_name: form.diet_name
        })
            .then(() => {
                if (onSuccess) onSuccess();
            })
            .catch(() => setError("Failed to update scholarship."))
            .finally(() => setLoading(false));
    };

    if (fetching) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Edit Scholarship</h2>
            <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Update Student</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-[200px_1fr_auto] md:items-end">
                    <div className="space-y-2">
                        <Label>Search By</Label>
                        <Select value={criteria} onValueChange={(value) => setCriteria(value as "reg_no" | "name")}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select criteria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="reg_no">Registration Number</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="student-search-edit">Search</Label>
                        <Input
                            id="student-search-edit"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={criteria === "reg_no" ? "e.g. ACC-2025-004" : "e.g. Kemi Ogunleye"}
                        />
                    </div>
                    <Button type="button" onClick={handleSearch} disabled={searching}>
                        {searching ? "Searching..." : "Search"}
                    </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                    Current student email: <span className="font-medium text-foreground">{form.email}</span>
                </div>
                {selectedStudent && (
                    <div className="rounded-lg border bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        Selected: {selectedStudent.title} {selectedStudent.firstname} {selectedStudent.lastname} • {selectedStudent.reg_no}
                    </div>
                )}
                {searchResults.length > 0 && (
                    <div className="space-y-2">
                        <Label>Results</Label>
                        <div className="space-y-2">
                            {searchResults.map((student) => (
                                <button
                                    type="button"
                                    key={student.reg_no}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                                        selectedStudent?.reg_no === student.reg_no
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-gray-200 hover:border-cyan-300"
                                    }`}
                                >
                                    <div className="font-medium">
                                        {student.title} {student.firstname} {student.lastname}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {student.reg_no} • {student.email}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="paper">Paper</Label>
                <Input id="paper" name="paper" value={form.paper} onChange={handleChange} placeholder="Paper" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input id="discount" name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="diet_name">Diet Name</Label>
                <Input id="diet_name" name="diet_name" value={form.diet_name} onChange={handleChange} placeholder="Diet Name" required />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
};
