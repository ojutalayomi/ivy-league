import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Diet } from "@/lib/types";
import { fetchReviews, type Review } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string): string {
    try {
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
        return dateStr;
    }
}

export function ReviewsPage() {
    const [diets, setDiets] = useState<Diet[]>([]);
    const [dietsLoading, setDietsLoading] = useState(true);
    const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setDietsLoading(true);
        api.get<Diet[]>("/all-diets?user_status=staff")
            .then((res) => {
                if (!cancelled) setDiets(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => {
                if (!cancelled) setDiets([]);
            })
            .finally(() => {
                if (!cancelled) setDietsLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    const loadReviews = useCallback((diet: Diet, paper: string) => {
        setSelectedDiet(diet);
        setSelectedPaper(paper);
        setReviewsLoading(true);
        setReviews([]);
        fetchReviews(paper, diet.diet_name ?? "")
            .then((data) => setReviews(Array.isArray(data) ? data : []))
            .catch(() => setReviews([]))
            .finally(() => setReviewsLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Paper reviews</h2>
                <p className="text-sm text-muted-foreground">Select a diet and paper to view student reviews.</p>
            </div>

            {dietsLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Diets and papers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {diets.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No diets available.</p>
                            ) : (
                                diets.map((diet) => (
                                    <div key={diet.diet_name ?? diet.title} className="space-y-2">
                                        <p className="text-sm font-medium">{diet.title ?? diet.diet_name}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(diet.papers ?? []).map((paper) => (
                                                <Button
                                                    key={paper}
                                                    variant={selectedDiet?.diet_name === diet.diet_name && selectedPaper === paper ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => loadReviews(diet, paper)}
                                                >
                                                    {paper}
                                                </Button>
                                            ))}
                                            {(!diet.papers || diet.papers.length === 0) && (
                                                <span className="text-xs text-muted-foreground">No papers</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                {selectedPaper && selectedDiet
                                    ? `Reviews for ${selectedPaper} (${selectedDiet.diet_name ?? selectedDiet.title})`
                                    : "Reviews"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!selectedPaper || !selectedDiet ? (
                                <p className="text-sm text-muted-foreground">Select a paper to view reviews.</p>
                            ) : reviewsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No reviews yet.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {reviews.map((r, i) => (
                                        <li key={i} className="rounded-lg border p-4 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((n) => (
                                                        <Star
                                                            key={n}
                                                            className={cn("w-4 h-4", n <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground")}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-medium">{r.rating}/5</span>
                                            </div>
                                            <p className="text-sm">{r.comment}</p>
                                            <p className="text-xs text-muted-foreground">{formatDate(r.created_at)}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
