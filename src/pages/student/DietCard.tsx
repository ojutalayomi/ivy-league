import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

type DietOption = {
  reg_starts: string;
  available: boolean;
  diet_name: string;
  message: string;
  diet_ends: string;
  reg_ends: string;
};

type DietCardProps = {
  className?: string;
  onDietChange?: (dietName: string | null, dietSelected: boolean) => void;
};

const DietCard = ({ className, onDietChange }: DietCardProps) => {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(localStorage.getItem('selectedDiet'));
  const [dietOptions, setDietOptions] = useState<DietOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/diets');
        setDietOptions(response.data);
      } catch (error) {
        console.error('Error fetching diets:', error);
        toast.error("Failed to fetch diets");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiets();
  }, []);

  useEffect(() => {
    if (selectedDiet) {
      localStorage.setItem('selectedDiet', selectedDiet);
    }
    onDietChange?.(selectedDiet, Boolean(selectedDiet));
  }, [onDietChange, selectedDiet]);
    
  return (
    <div className={className ?? "mb-2"}>
      <label className="block font-medium mb-3">
        Pick a diet (required)
      </label>
      {
        isLoading ? (
          <div className="flex items-center justify-center p-8 gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-muted-foreground">Loading diet options...</p>
          </div>
        ) : dietOptions.length > 0 ? (
          <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dietOptions
            .sort((a, b) => new Date(a.reg_ends).getTime() - new Date(b.reg_ends).getTime())
            .map((diet) => (
            <div
              key={diet.diet_name}
              onClick={() => diet.available ? setSelectedDiet(diet.diet_name) : null}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                diet.available 
                  ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' 
                  : 'cursor-not-allowed opacity-60'
              } ${
                selectedDiet === diet.diet_name
                  ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-cyan-400'
              }`}
            >
              {/* Selection Indicator */}
              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selectedDiet === diet.diet_name
                  ? 'border-cyan-500 bg-cyan-500 scale-110'
                  : 'border-gray-300 dark:border-gray-600 group-hover:border-cyan-400'
              }`}>
                {selectedDiet === diet.diet_name && (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                )}
              </div>

              {/* Diet Name Badge */}
              <div className="mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  selectedDiet === diet.diet_name
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  <span className="font-bold text-lg">{diet.diet_name}</span>
                </div>
              </div>

              {/* Diet Information */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {diet.message}
                </p>

                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-500 font-medium min-w-[120px]">Registration starts:</span>
                    <span className="text-gray-700 dark:text-gray-300">{diet.reg_starts}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-500 font-medium min-w-[120px]">Registration ends:</span>
                    <span className="text-gray-700 dark:text-gray-300">{diet.reg_ends}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-500 font-medium min-w-[120px]">Diet ends:</span>
                    <span className="text-gray-700 dark:text-gray-300">{diet.diet_ends}</span>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              {!diet.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 dark:bg-gray-900/30 backdrop-blur-[1px] rounded-xl">
                  <span className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white text-sm font-medium rounded-full">
                    Not Available
                  </span>
                </div>
              )}
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>No diet options available at the moment.</p>
          </div>
        )
      }
    </div>
  )
}

export default DietCard;