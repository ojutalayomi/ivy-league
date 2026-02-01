import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { PaperData } from "@/lib/types";
import { api } from "@/lib/api";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

export function SponsorshipRoutesWithModals() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Detect modal routes based on pathname
    const pathname = location.pathname;
    // const isCreateModal = /\/scholarship\/create\/?$/.test(pathname);
    // const isEditModal = /\/scholarship\/[^/]+\/edit\/?$/.test(pathname);
    // const isViewModal = /\/scholarship\/[^/]+\/?$/.test(pathname) && !isEditModal && !isCreateModal;
    
    // Extract sch_code from pathname
    const schCodeMatch = pathname.match(/\/sponsorship\/([^/]+)/);
    const sch_code = schCodeMatch ? schCodeMatch[1] : undefined;
    
    // const handleCloseView = () => {
    //     navigate('/sponsorship');
    // };
    
    const handleCloseEdit = () => {
        if (sch_code) {
            navigate(-1);
        } else {
            navigate('/sponsorship');
        }
    };
    
    return (
        <>
            <Routes>
                <Route index element={<Sponsorship/>} />
                <Route path="all" element={
                    <TabsContent value="all">
                        <Sponsorship />
                    </TabsContent>
                } />
                <Route path="create" element={<SponsorshipCreate/>} />
                <Route path=":sch_code" element={<SponsorshipView sch_code={sch_code} />} />
                <Route path=":sch_code/edit" element={<SponsorshipEdit sch_code={sch_code} onSuccess={() => handleCloseEdit()} />} />
            </Routes>
            
            {/* <Dialog open={isCreateModal} onOpenChange={(open) => !open && handleCloseCreate()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <SponsorshipCreate/>
                </DialogContent>
            </Dialog> */}
            
            {/* <Dialog open={isViewModal} onOpenChange={(open) => !open && handleCloseView()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <SponsorshipView sch_code={sch_code} />
                </DialogContent>
            </Dialog>
            
            <Dialog open={isEditModal} onOpenChange={(open) => !open && handleCloseEdit()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <SponsorshipEdit sch_code={sch_code} onSuccess={() => handleCloseEdit()} />
                </DialogContent>
            </Dialog> */}
        </>
    );
}

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Shape returned by /sponsorships API
type APISponsorship = {
    first_name: string;
    last_name: string;
    company_name: string;
    papers: string[];
    diet_name: string;
    created_at?: string;
    token: string;
    used: boolean;
};

export function Sponsorship() {
    const [sponsorships, setSponsorships] = useState<APISponsorship[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
            api.get("/sponsorships")
            .then((res) => {
                if (!cancelled) {
                    setSponsorships(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch(() => {
                setError("Failed to fetch sponsorships.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; }
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Sponsorships</h1>
                <Button onClick={() => navigate("/sponsorship/create")}>Create Sponsorship</Button>
            </div>
            {loading && <div className="py-12 text-center">Loading...</div>}
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {!loading && sponsorships.length === 0 && <div className="py-12 text-center text-gray-500">No sponsorships found.</div>}
            {!loading && sponsorships.length > 0 && (
                <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900 p-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Papers</TableHead>
                                <TableHead>Diet</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sponsorships.map((sp) => (
                                <TableRow key={sp.token}>
                                    <TableCell>{sp.first_name} {sp.last_name}</TableCell>
                                    <TableCell>{sp.company_name}</TableCell>
                                    <TableCell>{sp.papers.join(", ")}</TableCell>
                                    <TableCell>{sp.diet_name}</TableCell>
                                    <TableCell>{sp.used ? "Used" : "Unused"}</TableCell>
                                    <TableCell>{sp.created_at ? new Date(sp.created_at).toLocaleDateString() : ""}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => navigate(`/sponsorship/${sp.token}`)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/sponsorship/${sp.token}/edit`)}
                                            >
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

export const SponsorshipCreate = () => {
    // Define the shape of one sponsorship
    type Sponsorship = {
        first_name: string;
        last_name: string;
        company_name: string;
        papers: string[];
        diet_name: string;
    };

    // Single sponsorship form (user can pick multiple papers)
    const [form, setForm] = useState<Sponsorship>({
        first_name: "",
        last_name: "",
        company_name: "",
        papers: [],
        diet_name: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Papers selection state (similar to DietCreate)
    const [availablePapers, setAvailablePapers] = useState<PaperData[]>([]);
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [showPaperDialog, setShowPaperDialog] = useState(false);

    // Handle change for field in the sponsorship form
    const handleSponsorshipFieldChange = (
        field: keyof Sponsorship,
        value: string | number
    ) => {
        setForm(prevForm => {
            const updated = { ...prevForm };
            if (field === "papers") {
                updated[field] = Array.isArray(value)
                    ? (value as string[])
                    : [String(value)];
            } else {
                updated[field] = value as string;
            }
            return updated;
        });
    };

    // Fetch papers from /courses API (same endpoint as DietCreate)
    const fetchPapers = async () => {
        try {
            setLoadingPapers(true);
            const response = await api.get('/courses?reg=false&user_status=staff');
            setAvailablePapers(response.data || []);
        } catch (error) {
            console.error('Error fetching papers:', error);
        } finally {
            setLoadingPapers(false);
        }
    };

    // Select/deselect papers for the form.papers array
    const handlePaperSelection = (paperCode: string, isSelected: boolean) => {
        setForm(prevForm => {
            const currentPapers = prevForm.papers?.filter(code => code !== "") ? prevForm.papers : [];
            let newPapers: string[];
            if (isSelected) {
                if (!currentPapers.includes(paperCode)) {
                    newPapers = [...currentPapers, paperCode];
                } else {
                    newPapers = currentPapers;
                }
            } else {
                newPapers = currentPapers.filter(code => code !== paperCode);
            }
            return { ...prevForm, papers: newPapers };
        });
    };

    const getSelectedPaperNames = (papers: string[]) => {
        return (papers || []).map(code => {
            const paper = availablePapers.find(p =>
                Array.isArray(p.code) ? p.code.includes(code) : p.code === code
            );
            return paper ? `${paper.name} (${code})` : code;
        });
    };

    const groupedPapers = availablePapers.reduce((acc, paper) => {
        if (!acc[paper.category]) {
            acc[paper.category] = [];
        }
        acc[paper.category].push(paper);
        return acc;
    }, {} as Record<string, PaperData[]>);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate fields
        if (
            !form.first_name.trim() ||
            !form.last_name.trim() ||
            !form.company_name.trim() ||
            !form.papers.length ||
            !form.diet_name.trim()
        ) {
            setError("All fields are required for each sponsorship.");
            setLoading(false);
            return;
        }

        try {
            await api.post("/create-sponsorship", {
                first_name: form.first_name,
                last_name: form.last_name,
                company_name: form.company_name,
                papers: form.papers,
                diet_name: form.diet_name
            });
            navigate("/sponsorship");
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Failed to create sponsorship. Please try again.");
            } else {
                setError("Failed to create sponsorship. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Sponsorship</h1>
                    <p className="text-muted-foreground">
                        Enter sponsorship information below
                    </p>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-2">Sponsorship</h2>
                <div className="mb-4 space-y-2 border p-4 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={form.first_name}
                                onChange={e => handleSponsorshipFieldChange("first_name", e.target.value)}
                                placeholder="John"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={form.last_name}
                                onChange={e => handleSponsorshipFieldChange("last_name", e.target.value)}
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input
                                id="company_name"
                                name="company_name"
                                value={form.company_name}
                                onChange={e => handleSponsorshipFieldChange("company_name", e.target.value)}
                                placeholder="Company Inc."
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="diet_name">Diet Name</Label>
                            <Input
                                id="diet_name"
                                name="diet_name"
                                value={form.diet_name}
                                onChange={e => handleSponsorshipFieldChange("diet_name", e.target.value)}
                                placeholder="2025_December"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Papers for this Sponsorship *</Label><br/>
                            <Dialog open={showPaperDialog} onOpenChange={setShowPaperDialog}>
                                <DialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            if (availablePapers.length === 0) {
                                                fetchPapers();
                                            }
                                            setShowPaperDialog(true);
                                        }}
                                    >
                                        Select Papers
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Select Papers</DialogTitle>
                                        <DialogDescription>
                                            Choose the papers that this sponsorship can be applied to.
                                        </DialogDescription>
                                    </DialogHeader>

                                    {loadingPapers ? (
                                        <div className="flex items-center justify-center p-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            <p className="ml-3 text-muted-foreground">Loading papers...</p>
                                        </div>
                                    ) : availablePapers.length === 0 ? (
                                        <div className="text-center p-8 text-muted-foreground">
                                            <p>No papers available. Please check your connection and try again.</p>
                                            <Button
                                                variant="outline"
                                                onClick={fetchPapers}
                                                className="mt-4"
                                            >
                                                Retry
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {Object.entries(groupedPapers).map(([category, papers]) => (
                                                <div key={category} className="space-y-3">
                                                    <h3 className="font-semibold text-lg text-primary">{category}</h3>
                                                    <div className="grid gap-3 md:grid-cols-2">
                                                        {papers.map((paper, paperIndex) => {
                                                            const codes = Array.isArray(paper.code) ? paper.code : [paper.code];
                                                            return codes.map((code, codeIndex) => (
                                                                <div
                                                                    key={`${category}-${paperIndex}-${code}-${codeIndex}`}
                                                                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                                                                >
                                                                    <Checkbox
                                                                        id={`${code}`}
                                                                        checked={form.papers.includes(code)}
                                                                        onCheckedChange={(checked) =>
                                                                            handlePaperSelection(code, checked as boolean)
                                                                        }
                                                                    />
                                                                    <div className="flex-1">
                                                                        <Label
                                                                            htmlFor={`${code}`}
                                                                            className="text-sm font-medium cursor-pointer"
                                                                        >
                                                                            {paper.name}
                                                                        </Label>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Code: {code}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ));
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {(form.papers || []).length > 0 && (
                                        <div className="border-t pt-4">
                                            <p className="text-sm font-medium mb-2">
                                                Selected: {(form.papers || []).length} paper
                                                {(form.papers || []).length !== 1 ? 's' : ''}
                                            </p>
                                            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                                {getSelectedPaperNames(form.papers).map((paperName, index) => (
                                                    <span
                                                        key={(form.papers || [])[index]}
                                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                                    >
                                                        {paperName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowPaperDialog(false)}
                                        >
                                            Done ({(form.papers || []).length} selected)
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                {getSelectedPaperNames(form.papers).map((paperName, index) => (
                                    <span
                                        key={(form.papers || [])[index]}
                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                    >
                                        {paperName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-600">{error}</div>
            )}
            <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Sponsorship"}
            </Button>
        </form>
    );
};

type APISponsorshipFull = {
    first_name: string;
    last_name: string;
    company_name: string;
    papers: string[];
    diet_name: string;
    created_at?: string;
    token: string;
    used: boolean;
};

type SponsorshipViewProps = {
    sch_code?: string;
};

export const SponsorshipView: React.FC<SponsorshipViewProps> = ({ sch_code }) => {
    const [sponsorship, setSponsorship] = useState<APISponsorshipFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sch_code) {
            setError("Invalid sponsorship code.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        api.get("/sponsorships")
            .then((res) => {
                const found = Array.isArray(res.data)
                    ? res.data.find((s: APISponsorshipFull) => s.token === sch_code)
                    : null;
                if (found) {
                    setSponsorship(found);
                } else {
                    setError("Sponsorship not found.");
                }
            })
            .catch(() => setError("Failed to fetch sponsorship."))
            .finally(() => setLoading(false));
    }, [sch_code]);

    if (loading) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    if (!sponsorship) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Sponsorship Details</h2>
            <div>
                <strong>First Name:</strong> {sponsorship.first_name}
            </div>
            <div>
                <strong>Last Name:</strong> {sponsorship.last_name}
            </div>
            <div>
                <strong>Token:</strong> {sponsorship.token}
            </div>
            <div>
                <strong>Company Name:</strong> {sponsorship.company_name}
            </div>
            <div>
                <strong>Papers:</strong> {sponsorship.papers.join(", ")}
            </div>
            <div>
                <strong>Diet Name:</strong> {sponsorship.diet_name}
            </div>
            <div>
                <strong>Created At:</strong> {sponsorship.created_at ? new Date(sponsorship.created_at).toLocaleString() : "--"}
            </div>
        </div>
    );
};

type SponsorshipEditProps = {
    sch_code?: string;
    onSuccess?: () => void;
};

export const SponsorshipEdit: React.FC<SponsorshipEditProps> = ({ sch_code, onSuccess }) => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        company_name: "",
        papers: [""],
        diet_name: "",
        token: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [availablePapers, setAvailablePapers] = useState<PaperData[]>([]);
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [showPaperDialog, setShowPaperDialog] = useState(false);

    useEffect(() => {
        if (!sch_code) {
            setError("Invalid sponsorship code.");
            setFetching(false);
            return;
        }
        setFetching(true);
        setError(null);
        api.get("/sponsorships")
            .then((res) => {
                const found = Array.isArray(res.data)
                    ? res.data.find((s: APISponsorshipFull) => s.token === sch_code)
                    : null;
                if (found) {
                    setForm({
                        first_name: found.first_name,
                        last_name: found.last_name,
                        company_name: found.company_name,
                        papers: found.papers,
                        diet_name: found.diet_name,
                        token: found.token
                    });
                } else {
                    setError("Sponsorship not found.");
                }
            })
            .catch(() => setError("Failed to fetch sponsorship."))
            .finally(() => setFetching(false));
    }, [sch_code]);

    const fetchPapers = async () => {
        try {
            setLoadingPapers(true);
            const response = await api.get('/courses?reg=false&user_status=staff');
            setAvailablePapers(response.data || []);
        } catch (error) {
            console.error('Error fetching papers:', error);
        } finally {
            setLoadingPapers(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaperSelection = (paperCode: string, isSelected: boolean) => {
        setForm(prev => {
            const currentPapers = prev.papers || [];
            return {
                ...prev,
                papers: isSelected
                    ? [...currentPapers, paperCode]
                    : currentPapers.filter(code => code !== paperCode)
            };
        });
    };

    const getSelectedPaperNames = () => {
        return (form.papers || []).map(code => {
            const paper = availablePapers.find(p =>
                Array.isArray(p.code) ? p.code.includes(code) : p.code === code
            );
            return paper ? `${paper.name} (${code})` : code;
        });
    };

    const groupedPapers = availablePapers.reduce((acc, paper) => {
        if (!acc[paper.category]) {
            acc[paper.category] = [];
        }
        acc[paper.category].push(paper);
        return acc;
    }, {} as Record<string, PaperData[]>);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        if (!sch_code) {
            setError("Invalid sponsorship ID.");
            setLoading(false);
            return;
        }
        api.patch(`/edit-sponsorship`, {
            firstname: form.first_name,
            lastname: form.last_name,
            company_name: form.company_name,
            papers: form.papers,
            diet_name: form.diet_name,
            token: form.token
        })
            .then(() => {
                if (onSuccess) onSuccess();
            })
            .catch(() => setError("Failed to update sponsorship."))
            .finally(() => setLoading(false));
    };

    if (fetching) return <div className="p-4 text-center">Loading...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Edit Sponsorship</h2>
            <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" name="company_name" value={form.company_name} onChange={handleChange} placeholder="Company Name" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="papers">Papers</Label>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                        {form.papers.map((paper) => (
                            <span key={paper} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {paper}
                            </span>
                        ))}
                    </div>
            </div>
            <div className="space-x-2">
                <Label htmlFor="papers">Papers</Label>
                <Dialog open={showPaperDialog} onOpenChange={setShowPaperDialog}>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (availablePapers.length === 0) {
                                    fetchPapers();
                                }
                                setShowPaperDialog(true);
                            }}
                        >
                            Select Papers
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Select Papers</DialogTitle>
                            <DialogDescription>
                                Choose the papers that this sponsorship can be applied to.
                            </DialogDescription>
                        </DialogHeader>

                        {loadingPapers ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="ml-3 text-muted-foreground">Loading papers...</p>
                            </div>
                        ) : availablePapers.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                <p>No papers available. Please check your connection and try again.</p>
                                <Button
                                    variant="outline"
                                    onClick={fetchPapers}
                                    className="mt-4"
                                >
                                    Retry
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {Object.entries(groupedPapers).map(([category, papers]) => (
                                    <div key={category} className="space-y-3">
                                        <h3 className="font-semibold text-lg text-primary">{category}</h3>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            {papers.map((paper, paperIndex) => {
                                                const codes = Array.isArray(paper.code) ? paper.code : [paper.code];
                                                return codes.map((code, codeIndex) => (
                                                    <div
                                                        key={`${category}-${paperIndex}-${code}-${codeIndex}`}
                                                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                                                    >
                                                        <Checkbox
                                                            id={`edit-${code}`}
                                                            checked={(form.papers || []).includes(code)}
                                                            onCheckedChange={(checked) =>
                                                                handlePaperSelection(code, checked as boolean)
                                                            }
                                                        />
                                                        <div className="flex-1">
                                                            <Label
                                                                htmlFor={`edit-${code}`}
                                                                className="text-sm font-medium cursor-pointer"
                                                            >
                                                                {paper.name}
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground">
                                                                Code: {code}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ));
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(form.papers || []).length > 0 && (
                            <div className="border-t pt-4">
                                <p className="text-sm font-medium mb-2">
                                    Selected: {(form.papers || []).length} paper
                                    {(form.papers || []).length !== 1 ? 's' : ''}
                                </p>
                                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                    {getSelectedPaperNames().map((paperName, index) => (
                                        <span
                                            key={(form.papers || [])[index]}
                                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                                        >
                                            {paperName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowPaperDialog(false)}
                            >
                                Done ({(form.papers || []).length} selected)
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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
