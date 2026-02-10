import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { RootState } from "@/redux/store";

const MCQ_RESERVED_KEYS = ["Answer", "No", "Question"];

type McqMetadata = {
  diet_name: string;
  duration: number;
  high_score: number;
  paper: string;
  test_name: string;
  gateway?: boolean;
};

type McqQuestion = {
  Answer: string;
  No: number;
  Question: string;
  [key: string]: string | number;
};

function getOptionKeys(q: McqQuestion): string[] {
  return Object.keys(q)
    .filter((k) => !MCQ_RESERVED_KEYS.includes(k))
    .sort();
}

type McqResponse = {
  metadata: McqMetadata;
  questions: Record<string, McqQuestion>;
};

type SubmitMcqResponse = {
  [questionNo: string]: [string, string] | number | string;
  score: number;
  status: string;
};

function getApiPathFromPathname(pathname: string): string | null {
  const raw = pathname.replace(/^\/test\/?/, "").trim();
  if (!raw) return null;
  const decoded = raw
    .split("/")
    .map((s) => decodeURIComponent(s))
    .join("/");
  return decoded.startsWith("/") ? decoded : `/${decoded}`;
}

export default function Test() {
  const location = useLocation();
  const navigate = useNavigate();
  const apiPath = getApiPathFromPathname(location.pathname);
  const user = useSelector((state: RootState) => state.user);

  const [metadata, setMetadata] = useState<McqMetadata | null>(null);
  const [questions, setQuestions] = useState<Record<string, McqQuestion>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [submitDueToTime, setSubmitDueToTime] = useState(false);
  const [questionResults, setQuestionResults] = useState<Record<string, [string, string]>>({});
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.title = "Test - Ivy League Associates";
  }, []);

  useEffect(() => {
    if (apiPath == null) {
      setError("No test selected.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .get<McqResponse>("/get-mcq", { params: { path: apiPath } })
      .then((res) => {
        if (cancelled) return;
        const data = res.data;
        if (data?.metadata) setMetadata(data.metadata);
        if (data?.questions && typeof data.questions === "object")
          setQuestions(data.questions);
        else setQuestions({});
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message ?? "Failed to load test.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [apiPath]);

  const setAnswer = useCallback((no: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [no]: value }));
  }, []);

  const buildPayload = useCallback(
    (meta: McqMetadata, qs: Record<string, McqQuestion>, ans: Record<string, string>) => {
      const answersPayload: Record<number, string> = {};
      Object.entries(qs).forEach(([no, q]) => {
        const num = q.No;
        if (num != null) answersPayload[num] = ans[no] ?? "";
      });
      return {
        path: apiPath,
        email: user.email,
        test_name: meta.test_name,
        gateway: meta.gateway ?? false,
        answers: answersPayload,
      };
    },
    [apiPath, user.email]
  );

  useEffect(() => {
    if (!submitDueToTime || !metadata || !apiPath) return;
    const payload = buildPayload(metadata, questions, answers);
    let cancelled = false;
    setSubmitting(true);
    api
      .post<SubmitMcqResponse>("/submit-mcq", payload)
      .then((res) => {
        if (cancelled) return;
        const response = res.data;
        const results: Record<string, [string, string]> = {};
        Object.entries(response).forEach(([key, value]) => {
          if (key !== "score" && key !== "status" && Array.isArray(value) && value.length === 2) {
            results[key] = value as [string, string];
          }
        });
        setQuestionResults(results);
        setScore(response.score ?? 0);
        setTestStatus(response.status ?? null);
        setSubmitted(true);
        setSubmitDueToTime(false);
      })
      .catch(() => {
        if (cancelled) return;
        const entries = Object.entries(questions);
        let correct = 0;
        entries.forEach(([no, q]) => {
          if (answers[no] === q.Answer) correct += 1;
        });
        setScore(correct);
        setSubmitted(true);
        setSubmitDueToTime(false);
      })
      .finally(() => {
        if (!cancelled) setSubmitting(false);
      });
    return () => {
      cancelled = true;
    };
  }, [submitDueToTime, metadata, questions, answers, buildPayload, apiPath]);

  const endTimeRef = useRef<number | null>(null);
  const timerStartedRef = useRef(false);

  useEffect(() => {
    if (submitted || !metadata?.duration || timerStartedRef.current) return;
    timerStartedRef.current = true;
    const durationSec = metadata.duration;
    endTimeRef.current = Date.now() + durationSec * 1000;
    setSecondsRemaining(durationSec);
    timerRef.current = setInterval(() => {
      const remaining = endTimeRef.current
        ? Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
        : 0;
      setSecondsRemaining(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setSubmitDueToTime(true);
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [metadata?.duration, submitted]);

  const doSubmit = useCallback(() => {
    const entries = Object.entries(questions);
    if (entries.length === 0 || !metadata || !apiPath) return;
    setConfirmSubmitOpen(false);
    setSubmitting(true);
    const payload = buildPayload(metadata, questions, answers);
    api
      .post<SubmitMcqResponse>("/submit-mcq", payload)
      .then((res) => {
        const response = res.data;
        const results: Record<string, [string, string]> = {};
        Object.entries(response).forEach(([key, value]) => {
          if (key !== "score" && key !== "status" && Array.isArray(value) && value.length === 2) {
            results[key] = value as [string, string];
          }
        });
        setQuestionResults(results);
        setScore(response.score ?? 0);
        setTestStatus(response.status ?? null);
        setSubmitted(true);
      })
      .catch(() => {
        let correct = 0;
        entries.forEach(([no, q]) => {
          if (answers[no] === q.Answer) correct += 1;
        });
        setScore(correct);
        setSubmitted(true);
      })
      .finally(() => setSubmitting(false));
  }, [questions, answers, metadata, apiPath, buildPayload]);

  const questionList = Object.entries(questions).sort(
    ([, a], [, b]) => (a.No ?? 0) - (b.No ?? 0)
  );

  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToQuestion = useCallback((no: string) => {
    questionRefs.current[no]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const clearAnswer = useCallback((no: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[no];
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-muted-foreground">Loading test...</p>
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <AlertCircle className="w-10 h-10 text-destructive" />
            <p className="text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => navigate("/my-study")}>
              Back to My Study
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metadata || questionList.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No questions available.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/my-study")}
            >
              Back to My Study
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const durationText =
    metadata.duration >= 3600
      ? `${Math.floor(metadata.duration / 3600)} hr${Math.floor(metadata.duration / 3600) > 1 ? "s" : ""}${metadata.duration % 3600 >= 60 ? ` ${Math.floor((metadata.duration % 3600) / 60)} min` : ""}`
      : `${Math.floor(metadata.duration / 60)} min`;

  const timerDisplay =
    secondsRemaining != null
      ? `${Math.floor(secondsRemaining / 60)}:${String(secondsRemaining % 60).padStart(2, "0")}`
      : null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="font-semibold leading-none tracking-tight text-xl text-center">
            Ivy League Associates
        </div>
        <div className="flex flex-row gap-4 items-start">
            <div className="space-y-6">
                <header className="flex flex-wrap justify-between items-start gap-4 border-b pb-4 sticky top-0 bg-white/90 pt-1">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold">{metadata.test_name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Paper: {metadata.paper} · Diet: {metadata.diet_name} · {durationText} · Out of {metadata.high_score} marks
                        </p>
                    </div>
                    {timerDisplay != null && !submitted && secondsRemaining != null && (
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">Time remaining</p>
                        <p className={`text-lg font-mono font-semibold ${secondsRemaining <= 60 ? "text-destructive" : ""}`}>
                          {timerDisplay}
                        </p>
                      </div>
                    )}
                </header>

                {submitted ? (
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-2">
                                    <p className="font-medium text-lg">
                                        You scored {score ?? 0} out of {metadata.high_score}.
                                    </p>
                                    {testStatus && (
                                        <p className={`text-sm font-medium ${
                                            testStatus === "passed" ? "text-green-600" : "text-destructive"
                                        }`}>
                                            Status: {testStatus.charAt(0).toUpperCase() + testStatus.slice(1)}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => navigate("/my-study")}
                                >
                                    Back to My Study
                                </Button>
                            </CardContent>
                        </Card>
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Review Answers</h2>
                            {questionList.map(([no, q]) => {
                                const result = questionResults[String(q.No)];
                                const userAnswer = result?.[0] ?? "";
                                const correctAnswer = result?.[1] ?? "";
                                const isCorrect = userAnswer === correctAnswer && userAnswer !== "";
                                const optionKeys = getOptionKeys(q);
                                return (
                                    <Card key={no} className={isCorrect ? "border-green-500" : "border-destructive"}>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <p className="font-medium flex-1">
                                                    {q.No}. {q.Question}
                                                </p>
                                                {isCorrect ? (
                                                    <div className="flex items-center gap-1 text-green-600 font-medium shrink-0">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Correct
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-destructive font-medium shrink-0">
                                                        <XCircle className="w-4 h-4" />
                                                        Incorrect
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                {optionKeys.map((key) => {
                                                    const isSelected = userAnswer === key;
                                                    const isCorrectOption = correctAnswer === key;
                                                    let optionClass = "rounded-md border px-3 py-2 text-sm ";
                                                    if (isSelected && isCorrectOption) {
                                                        optionClass += "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-medium";
                                                    } else if (isSelected) {
                                                        optionClass += "border-destructive bg-destructive/10 text-destructive font-medium";
                                                    } else if (isCorrectOption) {
                                                        optionClass += "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-medium";
                                                    } else {
                                                        optionClass += "border-muted bg-muted/30 text-muted-foreground";
                                                    }
                                                    return (
                                                        <div key={key} className={optionClass}>
                                                            <span className="font-medium">{key}.</span> {String(q[key])}
                                                            {isSelected && <span className="ml-2 text-xs">(your answer)</span>}
                                                            {isCorrectOption && !isSelected && <span className="ml-2 text-xs text-green-600 dark:text-green-400">(correct)</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {questionList.map(([no, q]) => {
                                const optionKeys = getOptionKeys(q);
                                return (
                                    <div
                                    key={no}
                                    ref={(el) => {
                                        questionRefs.current[no] = el;
                                    }}
                                    >
                                        <Card>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="flex items-start justify-between gap-4">
                                                <p className="font-medium flex-1">
                                                    {q.No}. {q.Question}
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => clearAnswer(no)}
                                                    disabled={!answers[no]}
                                                >
                                                    Clear
                                                </Button>
                                                </div>
                                                <RadioGroup
                                                value={answers[no] ?? ""}
                                                onValueChange={(value) => setAnswer(no, value)}
                                                className="grid gap-3"
                                                >
                                                {optionKeys.map((key) => (
                                                    <div key={key} className="flex items-center space-x-3">
                                                    <RadioGroupItem value={key} id={`${no}-${key}`} />
                                                    <Label htmlFor={`${no}-${key}`} className="text-sm">
                                                        {key}. {String(q[key])}
                                                    </Label>
                                                    </div>
                                                ))}
                                                </RadioGroup>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                        <Button onClick={() => setConfirmSubmitOpen(true)} className="w-full" disabled={submitting}>
                            {submitting ? "Submitting…" : "Submit"}
                        </Button>
                        <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Submit test?</DialogTitle>
                                </DialogHeader>
                                <p className="text-sm text-muted-foreground">
                                    Are you sure you want to submit? You will not be able to change your answers after submitting.
                                </p>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setConfirmSubmitOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={doSubmit}>
                                        Yes, submit
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
            {!submitted && (
                <div className="sm:flex flex-wrap gap-1.5 p-2 hidden max-w-[200px] justify-end sticky top-0">
                    {questionList.map(([no, q]) => (
                        <button
                            key={no}
                            type="button"
                            onClick={() => scrollToQuestion(no)}
                            className={`w-8 h-8 rounded border text-xs font-medium shrink-0 flex items-center justify-center transition-colors ${
                            answers[no]
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/50 border-muted-foreground/30 hover:border-muted-foreground/50"
                            }`}
                            title={`Question ${q.No}`}
                        >
                            {q.No}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
