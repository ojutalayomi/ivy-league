import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Link, useLocation, useParams, useNavigate, Routes, Route } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APIPaper } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Edit, Eye, Loader2, Plus } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PapersRoutesWithModals() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Detect modal routes based on pathname
    const pathname = location.pathname;
    const isCreateModal = /\/papers\/create\/?$/.test(pathname);
    const isEditModal = /\/papers\/[^/]+\/edit\/?$/.test(pathname);
    const isViewModal = /\/papers\/[^/]+\/?$/.test(pathname) && !isEditModal && !isCreateModal;
    
    // Extract paper_code from pathname
    const paperCodeMatch = pathname.match(/\/papers\/([^/]+)/);
    const paper_code = paperCodeMatch ? paperCodeMatch[1] : undefined;
    
    const handleCloseCreate = () => {
        navigate('/papers');
    };
    
    const handleCloseView = () => {
        navigate('/papers');
    };
    
    const handleCloseEdit = () => {
        if (paper_code) {
            navigate(-1);
        } else {
            navigate('/papers');
        }
    };
    
    return (
        <>
            <Routes>
                <Route index element={<PapersPage/>} />
                <Route path="all" element={
                    <TabsContent value="all">
                        <PapersPage/>
                    </TabsContent>
                } />
                <Route path="create" element={<PapersPage/>} />
                <Route path=":paper_code" element={<PapersPage/>} />
                <Route path=":paper_code/edit" element={<PapersPage/>} />
            </Routes>
            
            <Dialog open={isCreateModal} onOpenChange={(open) => !open && handleCloseCreate()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <PapersCreate/>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isViewModal} onOpenChange={(open) => !open && handleCloseView()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <PapersView paper_code={paper_code} />
                </DialogContent>
            </Dialog>
            
            <Dialog open={isEditModal} onOpenChange={(open) => !open && handleCloseEdit()}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-auto min-w-[70vw] bg-gradient-to-br from-white via-white to-cyan-50 dark:from-gray-800 dark:to-gray-900">
                    <PapersEdit paper_code={paper_code} />
                </DialogContent>
            </Dialog>
        </>
    );
}

// Column definitions for the data table
const columns: ColumnDef<APIPaper>[] = [
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category;
            return (
                <div className="text-sm">{category || 'N/A'}</div>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.original.name;
            return (
                <div className="text-sm">{name || 'N/A'}</div>
            )
        },
    },
    {
        accessorKey: "code",
        header: "Code(s)",
        cell: ({ row }) => (
            <div className="text-sm">{row.original.code || 'N/A'}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="text-sm min-w-[200px]">{row.original.description || 'N/A'}</div>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
            <div className="text-sm">{row.original.price || 'N/A'}</div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
        const paper = row.original;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link to={`/papers/${paper.code}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link to={`/papers/${paper.code}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Paper
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Paper
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
        },
    },
];

export const PapersPage = () => {
    const { category } = useParams()
    const [papers, setPapers] = useState<APIPaper[]>([])
    const [filteredPapers, setFilteredPapers] = useState<APIPaper[]>([])
    const [filter, setFilter] = useState<string>('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setFilter(category || 'all')
        document.title = (category ? category[0].toUpperCase() + category.slice(1) : "All") + " Papers - Ivy League Associates";
    }, [category]);

    const filterPapers = useCallback((filter: string) => {
        if (filter && filter !== 'all') {
            return papers.filter(paper => 
                paper.category.toLowerCase() === filter ||
                paper.code.includes(filter)
            )
        }
        return papers    
    }, [papers])

    useEffect(() => {
        setFilteredPapers(filterPapers(filter))
    }, [filter, filterPapers])

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/all-papers');
                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                setPapers(data);
            } catch (error) {
                // Optionally, you could set an error state here
                console.error("Failed to fetch papers:", error);
            } finally {
                setLoading(false);
            }
        };
        (async () => {
            await fetchPapers();
        })();
    }, []);

    const getTitle = () => {
        switch(category) {
            case 'skill': return 'Skill Papers'
            case 'knowledge': return 'Knowledge Papers'
            case 'professional': return 'Professional Papers'
            case 'additional': return 'Additional Papers'
            default: return 'All Papers'
        }
    }

    return (
        <div className='space-y-6'>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{getTitle()}</h1>
                    <p className="text-muted-foreground">
                        Manage and view paper information
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select defaultValue={filter} onValueChange={setFilter}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder="Filter papers" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Papers</SelectItem>
                            <SelectItem value="skill">Skill Papers</SelectItem>
                            <SelectItem value="knowledge">Knowledge Papers</SelectItem>
                            <SelectItem value="professional">Professional Papers</SelectItem>
                            <SelectItem value="additional">Additional Papers</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Button variant="outline" asChild>
                    <Link to="/papers/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Paper
                    </Link>
                </Button>
            </div>
            
            <DataTable 
                loading={loading}
                columns={columns} 
                data={filteredPapers} 
                searchKey="name"
                searchPlaceholder="Search papers by name..."
                onBulkDelete={(selectedPapers) => {
                    console.log('Bulk delete papers:', selectedPapers);
                    // Implement bulk delete logic here
                }}
                onBulkExport={(selectedPapers) => {
                    console.log('Bulk export papers:', selectedPapers);
                    // Implement bulk export logic here
                }}
            />
        </div>
    );
}

export const PapersView = ({ paper_code: paperCodeProp }: { paper_code?: string } = {}) => {
    const params = useParams()
    const paper_code = paperCodeProp || params.paper_code
    const [paper, setPaper] = useState<APIPaper | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        let isMounted = true;
        if (!paper_code) {
            setLoading(false);
            return () => {
                isMounted = false;
            };
        }
        const fetchPaper = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/view-paper?paper_code=${paper_code}`);
                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                if (isMounted) setPaper(data);
            } catch (error) {
                if (isMounted) console.error("Failed to fetch paper:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchPaper();
        return () => {
            isMounted = false;
        };
    }, [paper_code]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="text-muted-foreground">Loading paper details...</span>
            </div>
        );
    }

    if (!paper) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] py-10">
                <div className="rounded-full bg-red-100 p-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0M12 9v2m0 4h.01" /></svg>
                </div>
                <div className="text-lg font-medium text-red-500">Paper not found</div>
                <div className="text-sm text-muted-foreground">The requested paper could not be found.</div>
            </div>
        );
    }
    return (
        <div className='space-y-6'>
            <h1 className="text-3xl font-bold tracking-tight">View Paper</h1>
            <p className="text-muted-foreground">
                View paper information
            </p>
            <div className="space-y-2">
                <Label>Name</Label>
                <div className="text-sm">{paper.name || 'N/A'}</div>
            </div>
            <div className="space-y-2">
                <Label>Code</Label>
                <div className="text-sm">{paper.code || 'N/A'}</div>
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <div className="text-sm">{paper.description || 'N/A'}</div>
            </div>
            <div className="space-y-2">
                <Label>Price</Label>
                <div className="text-sm">{paper.price || 'N/A'}</div>
            </div>
        </div>
    )
}

export const PapersCreate = () => {
    const [form, setForm] = useState({
        name: "",
        code: "",
        description: "",
        price: "",
        revision: "",
        category: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post("/create-paper", {
                name: form.name,
                code: form.code,
                desc: form.description,
                price: Number(form.price),
                revision: Number(form.revision),
                category: form.category,
            });
            navigate("/papers");
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Failed to create paper. Please try again.");
            } else {
                setError("Failed to create paper. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Paper</h1>
                    <p className="text-muted-foreground">
                        Enter paper information below
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Financial Modelling"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                    id="code"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. fmo"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Gbaskole is a placeholder for diet or paper title i do not remeber which"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="50000"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="revision">Revision</Label>
                <Input
                    id="revision"
                    name="revision"
                    type="number"
                    min="0"
                    value={form.revision}
                    onChange={handleChange}
                    placeholder="15000"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. soft skill"
                    required
                />
            </div>
            {error && (
                <div className="text-sm text-red-600">{error}</div>
            )}
            <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Paper"}
            </Button>
        </form>
    );
};

export const PapersEdit = (props?: { paper_code?: string }) => {
    const params = useParams()
    const paper_code = props?.paper_code || params.paper_code
    const [paper, setPaper] = useState<APIPaper | null>(null)
    const [loading, setLoading] = useState(true)
    const [showField, setShowField] = useState({
        name: true,
        code: true,
        description: true,
        price: true,
        revision: true,
        category: true,
    })
    const [form, setForm] = useState({
        name: "",
        code: "",
        description: "",
        price: "",
        revision: "",
        category: "",
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.patch("/edit-paper", {
                name: form.name,
                code: form.code,
                desc: form.description,
                price: Number(form.price),
                revision: Number(form.revision),
                category: form.category,
                real_code: paper_code,
                available: true
            });
            navigate("/papers");
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data?.message || "Failed to edit paper. Please try again.");
            } else {
                setError("Failed to edit paper. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        if (!paper_code) {
            setLoading(false);
            return () => {
                isMounted = false;
            };
        }
        const fetchPaper = async () => {
            try {
                setLoading(true);
                console.log("Paper Code: ",paper_code)
                const response = await api.get(`/view-paper?paper_code=${paper_code}`);
                if (response.status !== 200) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                if (isMounted) {
                    setPaper(data);
                    setShowField(e => ({ ...e, code: data.edit_code }));
                    setForm({
                        name: data.name,
                        code: data.code,
                        description: data.description,
                        price: data.price.toString(),
                        revision: data.revision.toString(),
                        category: data.category,
                    });
                }
            } catch (error) {
                if (isMounted) console.error("Failed to fetch paper:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchPaper();
        return () => {
            isMounted = false;
        };
    }, [paper_code]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="text-muted-foreground">Loading paper details...</span>
            </div>
        );
    }

    if (!paper) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[200px] py-10">
                <div className="rounded-full bg-red-100 p-3 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 11-12.728 0M12 9v2m0 4h.01" /></svg>
                </div>
                <div className="text-lg font-medium text-red-500">Paper not found</div>
                <div className="text-sm text-muted-foreground">The requested paper could not be found.</div>
            </div>
        );
    }
    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold tracking-tight">Edit Paper</h1>
            <p className="text-muted-foreground">
                Edit paper information below
            </p>
            <div className="space-y-2">
                <Label>Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Financial Modelling"
                    required
                />
            </div>
           {showField.code && ( 
                <div className="space-y-2 ">
                    <Label>Code</Label>
                    <Input
                        id="code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        placeholder="e.g. fmo"
                        required
                    />
                </div>
            )}
            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Gbaskole is a placeholder for diet or paper title i do not remeber which"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Price</Label>
                <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="50000"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Revision</Label>
                <Input
                    id="revision"
                    name="revision"
                    type="number"
                    min="0"
                    value={form.revision}
                    onChange={handleChange}
                    placeholder="15000"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Category</Label>
                <Input
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. soft skill"
                    required
                />
            </div>
            {error && (
                <div className="text-sm text-red-600">{error}</div>
            )}
            <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Paper"}
            </Button>
        </form>
    )
}