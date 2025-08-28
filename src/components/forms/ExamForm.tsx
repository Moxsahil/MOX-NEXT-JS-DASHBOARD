"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  examSchema,
  ExamSchema,
} from "@/lib/formValidationSchemas";
import {
  createExam,
  updateExam,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction(data);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Exam has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons } = relatedData;

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-10" onSubmit={onSubmit}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent-amber to-accent-orange rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {type === "create" ? "Create New Exam" : "Update Exam"}
        </h1>
        <p className="text-dark-text-secondary font-medium">
          {type === "create" 
            ? "Schedule a new exam for your students" 
            : "Update exam details and scheduling"
          }
        </p>
      </div>

        {/* Exam Information Section */}
        <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Exam Details</h3>
        </div>
          <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <InputField
              label="Exam Title"
              name="title"
              defaultValue={data?.title}
              register={register}
              error={errors?.title}
              required
              placeholder="Enter exam title..."
            />
            {data && (
              <InputField
                label="Id"
                name="id"
                defaultValue={data?.id}
                register={register}
                error={errors?.id}
                hidden
              />
            )}
            
            {/* Lesson Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1">
                Subject/Lesson <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.lessonId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("lessonId")}
                defaultValue={data?.lessonId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select subject/lesson...</option>
                {lessons.map((lesson: { id: number; name: string }) => (
                  <option value={lesson.id} key={lesson.id} className="bg-dark-secondary text-dark-text-primary">
                    {lesson.name}
                  </option>
                ))}
              </select>
              {errors.lessonId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.lessonId.message.toString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Schedule Section */}
        <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Schedule</h3>
        </div>
          <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <InputField
              label="Start Date & Time"
              name="startTime"
              defaultValue={data?.startTime}
              register={register}
              error={errors?.startTime}
              type="datetime-local"
              required
            />
            <InputField
              label="End Date & Time"
              name="endTime"
              defaultValue={data?.endTime}
              register={register}
              error={errors?.endTime}
              type="datetime-local"
              required
            />
            </div>
            <div className="mt-6 p-4 bg-accent-amber/10 border border-accent-amber/20 rounded-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm text-dark-text-primary">
              <svg className="w-4 h-4 text-accent-amber" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                Make sure to schedule exams with adequate time gaps between subjects to allow students proper rest.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="flex items-center gap-3 p-4 bg-status-error-bg border border-status-error-border rounded-xl">
          <svg className="w-5 h-5 text-status-error-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-status-error-text">Error occurred!</p>
            <p className="text-sm text-status-error-text/80">Something went wrong while {type === "create" ? "creating" : "updating"} the exam. Please try again.</p>
          </div>
        </div>
      )}

        {/* Submit Button */}
        <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
        >
          {type === "create" ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Exam
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Exam
            </>
          )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
