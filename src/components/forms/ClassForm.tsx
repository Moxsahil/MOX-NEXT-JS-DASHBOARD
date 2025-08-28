"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  classSchema,
  ClassSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createClass,
  createSubject,
  updateClass,
  updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ClassForm = ({
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
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
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
      toast(`Class has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { teachers, grades } = relatedData;

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-10" onSubmit={onSubmit}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {type === "create" ? "Create New Class" : "Update Class"}
        </h1>
        <p className="text-dark-text-secondary font-medium">
          {type === "create" 
            ? "Set up a new class with teacher and grade assignment" 
            : "Update class information and assignments"
          }
        </p>
      </div>

        {/* Class Information Section */}
        <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Class Information</h3>
        </div>
          <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <InputField
              label="Class Name"
              name="name"
              defaultValue={data?.name}
              register={register}
              error={errors?.name}
              required
              placeholder="Enter class name"
            />
            <InputField
              label="Capacity"
              name="capacity"
              type="number"
              defaultValue={data?.capacity}
              register={register}
              error={errors?.capacity}
              required
              placeholder="Maximum students"
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
            
            {/* Supervisor Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1">
                Supervisor <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.supervisorId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("supervisorId")}
                defaultValue={data?.supervisorId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select supervisor...</option>
                {teachers.map(
                  (teacher: { id: string; name: string; surname: string }) => (
                    <option value={teacher.id} key={teacher.id} className="bg-dark-secondary text-dark-text-primary">
                      {teacher.name} {teacher.surname}
                    </option>
                  )
                )}
              </select>
              {errors.supervisorId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.supervisorId.message.toString()}</span>
                </div>
              )}
            </div>
            
            {/* Grade Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1">
                Grade <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.gradeId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("gradeId")}
                defaultValue={data?.gradeId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select grade...</option>
                {grades.map((grade: { id: number; level: number }) => (
                  <option value={grade.id} key={grade.id} className="bg-dark-secondary text-dark-text-primary">
                    Grade {grade.level}
                  </option>
                ))}
              </select>
              {errors.gradeId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.gradeId.message.toString()}</span>
                </div>
              )}
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
            <p className="text-sm text-status-error-text/80">Something went wrong while {type === "create" ? "creating" : "updating"} the class. Please try again.</p>
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
                Create Class
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Class
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClassForm;
