import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Diet,APIPaper, PaperData } from "@/lib/types";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { PencilIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "react-router-dom";


export const DietPage = ({ all }: { all?: boolean }) => {
    const [diets, setDiets] = useState<Diet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDiets = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/diets?user_status=staff');
                setDiets(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching diets:', error);
                setError('Failed to fetch diets');
            } finally {
                setIsLoading(false);
            }
        };
        (async () => {
            await fetchDiets();
        })();
    }, []);

    const featuredDiets = all ? diets : diets.slice(0, 3); // Show first 3 diets

    return (
        <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    Diet Management
                    <div className="flex gap-2">
                        <Link to="/manage-students/diets/create" replace>
                            <Button size="sm">Create Diet</Button>
                        </Link>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center p-8 text-red-500">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Available Diets</h3>
                            <span className="text-sm text-muted-foreground">
                                Showing {featuredDiets.length} of {diets.length} diets
                            </span>
                        </div>
                        
                        {featuredDiets.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">
                                <p>No diets available at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                                {featuredDiets.map((diet, index) => (
                                    <DietCard key={diet.diet_name} index={index+diet.reg_ends} diet={diet} />
                                ))}
                            </div>
                        )}
                        
                        {diets.length > 3 && (
                            <div className="flex justify-center pt-4">
                                <Link to="/manage-students/diets/all">
                                    <Button variant="outline">
                                        View All Diets ({diets.length})
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
        </div>
    )
}

export const DietCreate = ({ diet, edit }: { diet?: Diet, edit?: boolean }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [availablePapers, setAvailablePapers] = useState<PaperData[]>([]);
    const [loadingPapers, setLoadingPapers] = useState(false);
    const [showPaperDialog, setShowPaperDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState<Diet>({
        title: '',
        description: '',
        exam_month: '',
        exam_year: '',
        diet_ends: '',
        reg_starts: '',
        reg_ends: '',
        revision_starts: '',
        revision_ends: '',
        available: true,
        papers: []
    });

    useEffect(() => {
        if (diet) {
            const [year, month] = diet.diet_name?.split('_') || [];
            setFormData({
                title: diet?.title || '',
                description: diet?.description || '',
                exam_month: month || '',
                exam_year: year || '',
                diet_ends: new Date(diet?.diet_ends).toISOString().slice(0, -1) || '',
                reg_starts: new Date(diet?.reg_starts).toISOString().slice(0, -1) || '',
                reg_ends: new Date(diet?.reg_ends).toISOString().slice(0, -1) || '',
                revision_starts: new Date(diet?.revision_starts).toISOString().slice(0, -1) || '',
                revision_ends: diet?.revision_deadline ? new Date(diet?.revision_deadline).toISOString().slice(0, -1) : new Date(diet?.revision_ends).toISOString().slice(0, -1) || '',
                available: true,
                papers: diet?.papers || []
            });
        }
    }, [diet]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.diet_ends || !formData.reg_ends) {
            setErrorMessage("Please fill in all required fields");
            setShowErrorDialog(true);
            return;
        }

        if (!formData.papers || formData.papers.length === 0) {
            setErrorMessage("Please select at least one paper for this diet");
            setShowErrorDialog(true);
            return;
        }

        // Date validation - prevent past dates
        const now = new Date();
        const dietEnd = new Date(formData.diet_ends);
        const regStart = new Date(formData.reg_starts);
        const regEnd = new Date(formData.reg_ends);
        const revisionStart = new Date(formData.revision_starts);
        const revisionEnd = new Date(formData.revision_ends);

        if (dietEnd < now) {
            setErrorMessage("Diet end date cannot be in the past");
            setShowErrorDialog(true);
            return;
        }

        if (regStart < now) {
            setErrorMessage("Registration start date cannot be in the past");
            setShowErrorDialog(true);
            return;
        }

        if (regEnd < now) {
            setErrorMessage("Registration end date cannot be in the past");
            setShowErrorDialog(true);
            return;
        }

        if (revisionStart < now) {
            setErrorMessage("Revision start date cannot be in the past");
            setShowErrorDialog(true);
            return;
        }

        if (revisionEnd < now) {
            setErrorMessage("Revision end date cannot be in the past");
            setShowErrorDialog(true);
            return;
        }

        // Additional logical date validation
        if (regEnd <= regStart) {
            setErrorMessage("Registration end date must be after registration start date");
            setShowErrorDialog(true);
            return;
        }

        if (dietEnd <= regEnd) {
            setErrorMessage("Diet end date must be after registration end date");
            setShowErrorDialog(true);
            return;
        }

        if (revisionEnd <= revisionStart) {
            setErrorMessage("Revision end date must be after revision start date");
            setShowErrorDialog(true);
            return;
        }

        try {
            setIsLoading(true);
            formData.diet_name = `${formData.exam_year}_${formData.exam_month}`;
            const response = await api.post(edit ? '/edit-diet' : '/create-diet', formData);
            
            if (response.status === 200 || response.status === 201) {
                toast.success(edit ? "Diet updated successfully!" : "Diet created successfully!");
                if (edit) {
                    navigate(`/manage-students/diets/${formData.diet_name}`);
                } else {
                    setFormData({
                        title: '',
                        exam_month: '',
                        exam_year: '',
                        description: '',
                        diet_ends: '',
                        reg_starts: '',
                        reg_ends: '',
                        revision_starts: '',
                        revision_ends: '',
                        available: true,
                        papers: []
                    });
                }
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                const message = error.response?.data?.error["Operation Failure"];
                console.error(`Error ${edit ? 'updating' : 'creating'} diet:`, message);
                setErrorMessage(message);
                setShowErrorDialog(true);
            } else {
                console.error(`Error ${edit ? 'updating' : 'creating'} diet:`, error);
                setErrorMessage(`Failed to ${edit ? 'update' : 'create'} diet. Please try again.`);
                setShowErrorDialog(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    // Fetch papers from /courses API
    const fetchPapers = async () => {
        try {
            setLoadingPapers(true);
            const response = await api.get('/courses?reg=false&user_status=staff');
            setAvailablePapers(response.data || []);
        } catch (error) {
            console.error('Error fetching papers:', error);
            toast.error("Failed to fetch papers");
        } finally {
            setLoadingPapers(false);
        }
    };

    const handlePaperSelection = (paperCode: string, isSelected: boolean) => {
        setFormData(prev => ({
            ...prev,
            papers: isSelected 
                ? [...(prev.papers || []), paperCode]
                : (prev.papers || []).filter(code => code !== paperCode)
        }));
    };

    const removePaper = (paperCode: string) => {
        setFormData(prev => ({
            ...prev,
            papers: (prev.papers || []).filter(code => code !== paperCode)
        }));
    };

    const getSelectedPaperNames = () => {
        return (formData.papers || []).map(code => {
            // Handle both API format (code as string) and local format (code as array)
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

    // Utility function to get current datetime in local format for datetime-local input
    const getCurrentDateTimeLocal = () => {
        const now = new Date();
        // Subtract timezone offset to get local time
        const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
        return localDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        {edit ? 'Edit Diet' : 'Create New Diet'}
                        <Link to="/manage-students/diet" replace>
                            <Button variant="outline" size="sm">Back to Diet Home</Button>
                        </Link>
                    </CardTitle>
                    <CardDescription>
                        {edit ? 'Edit the diet program for students to register for.' : 'Create a new diet program for students to register for.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Diet Name *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Summer Diet Program 2024"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="diet_ends">Diet End Date *</Label>
                                <Input
                                    id="diet_ends"
                                    name="diet_ends"
                                    type="datetime-local"
                                    min={getCurrentDateTimeLocal()}
                                    value={formData.diet_ends}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description/Message *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe the diet program, its benefits, requirements, etc."
                                className="min-h-[100px]"
                                maxLength={1000}
                                required
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="reg_starts">Registration Start Date *</Label>
                                <Input
                                    id="reg_starts"
                                    name="reg_starts"
                                    type="datetime-local"
                                    min={getCurrentDateTimeLocal()}
                                    value={formData.reg_starts}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="reg_ends">Registration End Date *</Label>
                                <Input
                                    id="reg_ends"
                                    name="reg_ends"
                                    type="datetime-local"
                                    min={getCurrentDateTimeLocal()}
                                    value={formData.reg_ends}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="exam_month">Exam Month *</Label>
                                <Select
                                    value={formData.exam_month}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, exam_month: value }))
                                    }
                                    disabled={edit}
                                >
                                    <SelectTrigger id="exam_month" name="exam_month" className="w-full">
                                        <SelectValue placeholder="Select month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="January">January</SelectItem>
                                        <SelectItem value="February">February</SelectItem>
                                        <SelectItem value="March">March</SelectItem>
                                        <SelectItem value="April">April</SelectItem>
                                        <SelectItem value="May">May</SelectItem>
                                        <SelectItem value="June">June</SelectItem>
                                        <SelectItem value="July">July</SelectItem>
                                        <SelectItem value="August">August</SelectItem>
                                        <SelectItem value="September">September</SelectItem>
                                        <SelectItem value="October">October</SelectItem>
                                        <SelectItem value="November">November</SelectItem>
                                        <SelectItem value="December">December</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="exam_year">Exam Year *</Label>
                                <Select
                                    value={formData.exam_year}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, exam_year: value }))
                                    }
                                    disabled={edit}
                                >
                                    <SelectTrigger id="exam_year" name="exam_year" className="w-full">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 100 }, (_, i) => {
                                            const year = new Date().getFullYear() + i;
                                            return (
                                                <SelectItem key={year} value={year.toString()}>
                                                    {year}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="revision_starts">Revision Start Date *</Label>
                                <Input
                                    id="revision_starts"
                                    name="revision_starts"
                                    type="datetime-local"
                                    min={getCurrentDateTimeLocal()}
                                    value={formData.revision_starts}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="revision_ends">Revision Deadline *</Label>
                                <Input
                                    id="revision_ends"
                                    name="revision_ends"
                                    type="datetime-local"
                                    min={getCurrentDateTimeLocal()}
                                    value={formData.revision_ends}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Papers Selection Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Papers for this Diet *</Label>
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
                                            <DialogTitle>Select Papers for Diet</DialogTitle>
                                            <DialogDescription>
                                                Choose the papers that will be available in this diet program.
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
                                                                // Handle both API format (code as string) and local format (code as array)
                                                                const codes = Array.isArray(paper.code) ? paper.code : [paper.code];
                                                                return codes.map((code, codeIndex) => (
                                                                    <div key={`${category}-${paperIndex}-${code}-${codeIndex}`} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                                                                        <Checkbox
                                                                            id={code}
                                                                            checked={(formData.papers || []).includes(code)}
                                                                            onCheckedChange={(checked) => 
                                                                                handlePaperSelection(code, checked as boolean)
                                                                            }
                                                                        />
                                                                        <div className="flex-1">
                                                                            <Label htmlFor={code} className="text-sm font-medium cursor-pointer">
                                                                                {paper.name}
                                                                            </Label>
                                                                            <p className="text-xs text-muted-foreground">
                                                                                Code: {code} 
                                                                                {/* | Price: ₦{
                                                                                    Array.isArray(paper.price) 
                                                                                        ? (paper.price[0] || 0).toLocaleString() 
                                                                                        : (paper.price || 0).toLocaleString()
                                                                                } */}
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
                                        
                                        {(formData.papers || []).length > 0 && (
                                            <div className="border-t pt-4">
                                                <p className="text-sm font-medium mb-2">
                                                    Selected: {(formData.papers || []).length} paper{(formData.papers || []).length !== 1 ? 's' : ''}
                                                </p>
                                                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                                    {getSelectedPaperNames().map((paperName, index) => (
                                                        <span key={(formData.papers || [])[index]} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
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
                                                Done ({(formData.papers || []).length} selected)
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            
                            {/* Selected Papers Display */}
                            {(formData.papers || []).length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Selected Papers ({(formData.papers || []).length}):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {getSelectedPaperNames().map((paperName, index) => (
                                            <div key={(formData.papers || [])[index]} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                                {paperName}
                                                <button
                                                    type="button"
                                                    onClick={() => removePaper((formData.papers || [])[index])}
                                                    className="ml-1 text-primary hover:text-primary/70"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No papers selected. Click "Select Papers" to add papers to this diet.
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={isLoading} className="flex-1">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {edit ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    edit ? 'Update Diet' : 'Create Diet'
                                )}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setFormData({
                                    title: '',
                                    exam_month: '',
                                    exam_year: '',
                                    description: '',
                                    diet_ends: '',
                                    reg_starts: '',
                                    reg_ends: '',
                                    revision_starts: '',
                                    revision_ends: '',
                                    available: true,
                                    papers: []
                                })}
                                className="flex-1"
                                disabled={edit}
                            >
                                Clear Form
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Error {edit ? 'Updating' : 'Creating'} Diet</DialogTitle>
                        <DialogDescription>
                            {errorMessage}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export const DietView = () => {
    const { diet_name } = useParams();
    const [diet, setDiet] = useState<Diet | null>(null);
    const [papers, setPapers] = useState<APIPaper[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (papers.length > 0) return;
            try {
                setIsLoading(true);
                const [dietsResponse, papersResponse] = await Promise.all([
                    api.get('/diets?user_status=staff'),
                    api.get('/courses?user_status=staff')
                ]);
                const diet = dietsResponse.data.find((diet: Diet) => diet.diet_name === diet_name);
                setDiet(diet || null);
                setPapers(papersResponse.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching diet:', error);
                setError('Failed to fetch diet');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
            <div className="flex flex-col gap-2">
            {isLoading ? (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            ) : error ? (
                <div className="text-center p-8 text-red-500">
                    <p>{error}</p>
                </div>
            ) : diet ? (
                <DietCard index={0} diet={diet} papers={papers} />
            ) : null 
            }
        </div>
    )
}

export const DietCard = ({index, diet, papers}: {index: number | string, diet: Diet, papers?: APIPaper[]}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const groupedPapers = papers?.reduce((acc, paper) => {
        if(diet.papers.includes(paper.code)) {
           acc.push(paper) 
        }
        return acc;
    }, [] as APIPaper[])

    return (
        <Card key={`featured-diet-${index}-${diet.title}`} onClick={() => navigate(`/manage-students/diets/${diet.diet_name}`)} className={`h-full min-h-full`}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                    {diet.title}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        diet.available 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                        {diet.available ? 'Available' : 'Unavailable'}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{diet.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Diet Name</span>
                        <span className="font-semibold">{diet.diet_name}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Diet Ends</span>
                        <span className="font-semibold">{new Date(diet.diet_ends).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Registration Ends</span>
                        <span className="font-semibold">{new Date(diet.reg_ends).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">Revision Starts</span>
                        <span className="font-semibold">{new Date(diet.revision_starts).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <span className="text-muted-foreground">Revision Deadline</span>
                        <span className="font-semibold">{new Date(diet.revision_ends || diet.revision_deadline || '').toLocaleDateString()}</span>
                    </div>
                </div>

                <p className="text-sm font-medium mb-1">Papers for this diet:</p>
                <div className="text-xs grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {groupedPapers?.map((paper, paperIndex) => (
                        <div key={`${paper.category}-${paperIndex}`} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                            <div className="flex-1">
                                <Label htmlFor={paper.code} className="text-sm font-medium cursor-pointer">
                                    {paper.name}
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Code: {paper.code}{" "} 
                                    | Price: ₦{
                                        Array.isArray(paper.price) 
                                            ? (paper.price[0] || 0).toLocaleString() 
                                            : (paper.price || 0).toLocaleString()
                                    }
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Category: {paper.category}
                                </p>
                            </div>
                        </div>
                    ))}
                    {(groupedPapers === undefined && diet.papers?.length > 0) && (
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-2 col-span-full">
                            {diet.papers?.map((paper) => (
                                <Badge key={paper}>{paper}</Badge>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-between">
                    <span className={`text-xs text-muted-foreground cursor-pointer hover:underline ${location.pathname.includes(`diets/${diet.diet_name}`) ? 'hidden' : ''}`}>View more details</span>
                    <Link to={`/manage-students/diets/${diet.diet_name}/edit`} onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm">
                            Edit
                            <PencilIcon className="size-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export const DietEdit = () => {
    const { diet_name } = useParams();
    const [diet, setDiet] = useState<Diet | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get(`/diets?user_status=staff`);
            setDiet(response.data.find((diet: Diet) => diet.diet_name === diet_name));
        };
        fetchData();
    }, []);

    return <DietCreate diet={diet || undefined} edit={true} />
}
