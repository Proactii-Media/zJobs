import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-select";

interface JobRatingFormProps {
  jobId: string;
  currentRating: number;
  onRatingSubmit: (rating: number) => void;
}

const JobRatingForm: React.FC<JobRatingFormProps> = ({
  jobId,
  currentRating,
  onRatingSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) throw new Error("Failed to submit rating");

      const updatedJob = await response.json();
      onRatingSubmit(updatedJob.rating);
      setRating(0);
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Rate This Job
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Current Rating:</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{currentRating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-600">
              How would you rate this job opportunity?
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className="group relative"
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(value)}
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-150 ${
                      (hoveredRating || rating) >= value
                        ? "text-yellow-400 fill-current"
                        : "text-gray-200"
                    } ${
                      hoveredRating === value
                        ? "scale-125"
                        : "group-hover:scale-110"
                    }`}
                  />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">
                    {value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              "Submit Rating"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobRatingForm;
