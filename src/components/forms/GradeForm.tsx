"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useState } from "react";

const schema = z.object({
  level: z.coerce
    .number()
    .min(1, { message: "Grade level must be at least 1" })
    .max(12, { message: "Grade level cannot exceed 12" }),
});

type Inputs = z.infer<typeof schema>;

const GradeForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  const [state, setState] = useState({
    success: false,
    error: false,
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setState({ success: false, error: false });

      const response = await fetch(`/api/grade`, {
        method: type === "create" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          id: data?.id,
        }),
      });

      if (response.ok) {
        setState({ success: true, error: false });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        setState({ success: false, error: true });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setState({ success: false, error: true });
    }
  });

  return (
    <form className="flex flex-col gap-10" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold text-gradient">
        {type === "create" ? "Create a new grade" : "Update grade"}
      </h1>

      <div className="flex justify-between flex-wrap gap-8">
        <InputField
          label="Grade Level"
          name="level"
          type="number"
          register={register}
          error={errors?.level}
          placeholder="Enter grade level (1-12)"
        />
      </div>

      <div className="flex flex-col gap-4">
        {state.error && (
          <div className="bg-status-error-bg border border-status-error-border text-status-error-text px-4 py-3 rounded-lg flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              Something went wrong. Please try again.
            </span>
          </div>
        )}

        {state.success && (
          <div className="bg-status-success-bg border border-status-success-border text-status-success-text px-4 py-3 rounded-lg flex items-center gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm font-medium">
              Grade {type === "create" ? "created" : "updated"} successfully!
            </span>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white py-4 px-8 rounded-xl font-semibold text-base transition-all duration-200 hover:shadow-glow hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={state.success}
        >
          {state.success ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Redirecting...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    type === "create"
                      ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                      : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  }
                />
              </svg>
              {type === "create" ? "Create Grade" : "Update Grade"}
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default GradeForm;