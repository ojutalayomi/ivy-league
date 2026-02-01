import { Check } from "lucide-react";
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

  useEffect(() => {
    const fetchDiets = async () => {
      try {
        const response = await api.get('/diets');
        setDietOptions(response.data);
      } catch (error) {
        console.error('Error fetching diets:', error);
        toast.error("Failed to fetch diets");
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
      <label className="block text-xl font-medium mb-3">
        Pick a diet (required)
      </label>
      {
        dietOptions.length > 0 ? (
            <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {dietOptions
                .sort((a, b) => new Date(a.reg_ends).getTime() - new Date(b.reg_ends).getTime())
                .map((diet) => (
                <div
                    key={diet.diet_name}
                    onClick={() => diet.available ? setSelectedDiet(diet.diet_name) : null}
                    className={`p-4 rounded-lg border ${diet.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} transition-all dark:bg-slate-800 hover:border-cyan-400 ${
                    selectedDiet === diet.diet_name
                        ? 'border-cyan-500 ring-1 ring-cyan-500'
                        : 'border-slate-600'
                    }`}
                >
                    <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center">
                        <span className={`text-cyan-400 font-bold mr-3 ${diet.available ? '' : 'opacity-50'}`}>{diet.diet_name}</span>
                        </div>
                        <p className={`text-sm text-gray-400 dark:text-gray-400 mt-2 ml-6 ${diet.available ? '' : 'opacity-50'}`}>
                        {diet.message}
                        </p>
                        <p className={`text-sm text-gray-400 dark:text-gray-400 mt-2 ml-6 ${diet.available ? '' : 'opacity-50'}`}>
                        Registration starts: {diet.reg_starts}
                        </p>
                        <p className={`text-sm text-gray-400 dark:text-gray-400 mt-2 ml-6 ${diet.available ? '' : 'opacity-50'}`}>
                        Registration ends: {diet.reg_ends}
                        </p>
                        <p className={`text-sm text-gray-400 dark:text-gray-400 mt-2 ml-6 ${diet.available ? '' : 'opacity-50'}`}>
                        Diet ends: {diet.diet_ends}
                        </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ml-3 mt-0.5 flex-shrink-0 ${diet.available ? '' : 'opacity-50'} ${
                        selectedDiet === diet.diet_name
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-slate-500'
                    }`}>
                        {selectedDiet === diet.diet_name && (
                        <Check className="w-2.5 h-2.5 text-white m-auto" />
                        )}
                    </div>
                    </div>
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