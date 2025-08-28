"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  resultSchema,
  ResultSchema,
} from "@/lib/formValidationSchemas";
import {
  createResult,
  updateResult,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ResultForm = ({
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
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction({...data});
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students, exams, assignments } = relatedData;

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-10" onSubmit={onSubmit}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent-cyan to-accent-teal rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {type === "create" ? "Record New Result" : "Update Result"}
          </h1>
          <p className="text-dark-text-secondary font-medium">
            {type === "create" 
              ? "Enter student exam results and scores" 
              : "Update student performance data"
            }
          </p>
        </div>
      </div>

        {/* Result Information Section */}
        <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Result Details</h3>
        </div>
          <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <InputField
              label="Score"
              name="score"
              type="number"
              register={register}
              error={errors?.score}
              required
              placeholder="Enter score (0-100)"
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
            
            {/* Student Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1">
                Student <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.studentId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("studentId")}
                defaultValue={data?.studentId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select student...</option>
                {students?.map((student: { id: string; name: string }) => (
                  <option value={student.id} key={student.id} className="bg-dark-secondary text-dark-text-primary">
                    {student.name}
                  </option>
                ))}
                {(!students || students.length === 0) && (
                  <option disabled className="bg-dark-secondary text-dark-text-secondary">No students available</option>
                )}
              </select>
              {errors.studentId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.studentId?.message.toString()}</span>
                </div>
              )}
            </div>

            {/* Exam Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary">Exam (Optional)</label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.examId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("examId")}
                defaultValue={data?.examId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">No specific exam</option>
                {exams?.map((exam: { id: number; title: string }) => (
                  <option value={exam.id} key={exam.id} className="bg-dark-secondary text-dark-text-primary">
                    {exam.title}
                  </option>
                ))}
                {(!exams || exams.length === 0) && (
                  <option disabled className="bg-dark-secondary text-dark-text-secondary">No exams available</option>
                )}
              </select>
              {errors.examId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.examId?.message.toString()}</span>
                </div>
              )}
            </div>

            {/* Assignment Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary">Assignment (Optional)</label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.assignmentId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("assignmentId")}
                defaultValue={data?.assignmentId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">No specific assignment</option>
                {assignments?.map((assignment: { id: number; title: string }) => (
                  <option value={assignment.id} key={assignment.id} className="bg-dark-secondary text-dark-text-primary">
                    {assignment.title}
                  </option>
                ))}
                {(!assignments || assignments.length === 0) && (
                  <option disabled className="bg-dark-secondary text-dark-text-secondary">No assignments available</option>
                )}
              </select>
              {errors.assignmentId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.assignmentId?.message.toString()}</span>
                </div>
              )}
            </div>
            </div>
            
            {/* Score Guidelines */}
            <div className="mt-8 p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-sm text-dark-text-primary mb-2">
                <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium">Grading Scale</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                  <div className="font-semibold text-green-800">A: 90-100</div>
                  <div className="text-green-600">Excellent</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-center">
                  <div className="font-semibold text-blue-800">B: 80-89</div>
                  <div className="text-blue-600">Good</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-center">
                  <div className="font-semibold text-yellow-800">C: 70-79</div>
                  <div className="text-yellow-600">Average</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-center">
                  <div className="font-semibold text-red-800">Below 70</div>
                  <div className="text-red-600">Needs Improvement</div>
                </div>
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
            <p className="text-sm text-status-error-text/80">Something went wrong while {type === "create" ? "creating" : "updating"} the result. Please try again.</p>
          </div>
        </div>
      )}

        {/* Submit Button */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="btn-secondary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
          >
            {type === "create" ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Record Result</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Update Result</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResultForm;