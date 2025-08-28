"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { announcementSchema, AnnouncementSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AnnouncementForm = ({
    type,
    data,
    setOpen,
    relatedData,
  }: {
    type: "create" | "update";
    data?: AnnouncementSchema;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: { classes: { id: number; name: string }[] };
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<AnnouncementSchema>({
      resolver: zodResolver(announcementSchema),
      defaultValues: data,
    });
  
    const [state, formAction] = useFormState(
      type === "create" ? createAnnouncement : updateAnnouncement,
      {
        success: false,
        error: false,
      }
    );
  
    const onSubmit = handleSubmit((formData) => {
      formAction(formData);
    });
  
    const router = useRouter();
  
    useEffect(() => {
      if (state.success) {
        toast(
          `Announcement has been ${type === "create" ? "created" : "updated"}!`
        );
        setOpen(false);
        router.refresh();
      }
    }, [state, router, type, setOpen]);
  
    const { classes } = relatedData || { classes: [] };
  
    return (
      <div className="space-y-10 p-10">
        <form className="space-y-10" onSubmit={onSubmit}>
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent-amber to-accent-orange rounded-2xl flex items-center justify-center shadow-glow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              {type === "create" ? "Create New Announcement" : "Update Announcement"}
            </h1>
            <p className="text-dark-text-secondary font-medium">
              {type === "create" 
                ? "Share important news with students and parents" 
                : "Update announcement details and target audience"
              }
            </p>
          </div>
        </div>

          {/* Announcement Information Section */}
          <div className="space-y-8">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dark-text-primary">Announcement Details</h3>
          </div>
            <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <InputField
                label="Announcement Title"
                name="title"
                register={register}
                error={errors?.title}
                required
                placeholder="Enter announcement title..."
              />
              <InputField
                label="Description"
                name="description"
                register={register}
                error={errors?.description}
                required
                placeholder="Enter announcement description..."
              />
              <InputField
                label="Date"
                name="date"
                type="date"
                register={register}
                error={errors?.date}
                required
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
              </div>
            </div>
          </div>

          {/* Target Audience Section */}
          <div className="space-y-8">
          <div className="flex items-center gap-3 pb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-secondary to-accent-purple rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dark-text-primary">Target Audience</h3>
          </div>
            <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-8">
              {/* Class Select */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-dark-text-primary">Target Class (Optional)</label>
                <select
                  className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                    errors.classId
                      ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                      : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                  }`}
                  {...register("classId")}
                  defaultValue={data?.classId}
                >
                  <option value="" className="bg-dark-secondary text-dark-text-primary">All classes (school-wide)</option>
                  {classes.map((classItem: { id: number; name: string }) => (
                    <option value={classItem.id} key={classItem.id} className="bg-dark-secondary text-dark-text-primary">
                      {classItem.name}
                    </option>
                  ))}
                </select>
                {errors.classId?.message && (
                  <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{errors.classId.message}</span>
                  </div>
                )}
              </div>
                
                {/* Info Box */}
                <div className="mt-8 p-6 bg-status-info-bg border border-status-info-border rounded-2xl">
                  <div className="flex items-center gap-3 text-sm text-status-info-text">
                    <svg className="w-5 h-5 text-status-info-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">
                      Leave class field empty to send announcement to all classes and parents.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Error Message */}
        {state.error && (
          <div className="flex items-center gap-4 p-6 bg-status-error-bg border border-status-error-border rounded-2xl backdrop-blur-xl">
            <div className="w-12 h-12 bg-status-error-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-status-error-text text-lg">Error occurred!</p>
              <p className="text-sm text-status-error-text/80 mt-1">Something went wrong while {type === "create" ? "creating" : "updating"} the announcement. Please try again.</p>
            </div>
          </div>
        )}

          {/* Submit Button */}
          <div className="flex gap-4 justify-end pt-4">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type === "create" ? "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
              </svg>
              <span>{type === "create" ? "Create Announcement" : "Update Announcement"}</span>
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default AnnouncementForm;