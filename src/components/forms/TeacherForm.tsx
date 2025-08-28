"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const TeacherForm = ({
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
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { subjects } = relatedData;

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-brand-success to-accent-emerald rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {type === "create" ? "Create New Teacher" : "Update Teacher"}
          </h1>
          <p className="text-dark-text-secondary font-medium">
            {type === "create" 
              ? "Add a new teacher to your school system" 
              : "Update teacher information and settings"
            }
          </p>
        </div>
      </div>

      {/* Authentication Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Authentication Information</h3>
        </div>
        <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InputField
              label="Username"
              name="username"
              defaultValue={data?.username}
              register={register}
              error={errors?.username}
              required
              placeholder="Enter unique username"
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              defaultValue={data?.email}
              register={register}
              error={errors?.email}
              required
              placeholder="teacher@school.com"
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              defaultValue={data?.password}
              register={register}
              error={errors?.password}
              required={type === "create"}
              placeholder="Enter secure password"
            />
          </div>
        </div>
      </div>
      {/* Personal Information Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-secondary to-accent-indigo rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Personal Information</h3>
        </div>
        <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <InputField
              label="First Name"
              name="name"
              defaultValue={data?.name}
              register={register}
              error={errors.name}
              required
            />
            <InputField
              label="Last Name"
              name="surname"
              defaultValue={data?.surname}
              register={register}
              error={errors.surname}
              required
            />
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              defaultValue={data?.phone}
              register={register}
              error={errors.phone}
            />
            <InputField
              label="Address"
              name="address"
              defaultValue={data?.address}
              register={register}
              error={errors.address}
            />
            <InputField
              label="Blood Type"
              name="bloodType"
              defaultValue={data?.bloodType}
              register={register}
              error={errors.bloodType}
              placeholder="e.g. A+, B-, O+"
            />
            <InputField
              label="Birthday"
              name="birthday"
              defaultValue={data?.birthday.toISOString().split("T")[0]}
              register={register}
              error={errors.birthday}
              type="date"
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
            {/* Gender Select */}
            <div className="flex flex-col gap-4 w-full">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-2">
                Gender <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.sex
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("sex")}
                defaultValue={data?.sex}
              >
                <option value="" className="bg-dark-secondary text-dark-text-secondary">Select gender...</option>
                <option value="MALE" className="bg-dark-secondary text-dark-text-primary">👨 Male</option>
                <option value="FEMALE" className="bg-dark-secondary text-dark-text-primary">👩 Female</option>
              </select>
              {errors.sex?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.sex.message.toString()}</span>
                </div>
              )}
            </div>
            
            {/* Subjects Multi-select */}
            <div className="flex flex-col gap-4 w-full md:col-span-2">
              <label className="text-sm font-semibold text-dark-text-primary">Subjects</label>
              <select
                multiple
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary min-h-[140px] ${
                  errors.subjects
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("subjects")}
                defaultValue={data?.subjects}
              >
                {subjects.map((subject: { id: number; name: string }) => (
                  <option value={subject.id} key={subject.id} className="py-2 bg-dark-secondary text-dark-text-primary">
                    📚 {subject.name}
                  </option>
                ))}
              </select>
              {errors.subjects?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.subjects.message.toString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Photo Upload */}
          <div className="mt-8 pt-8 border-t border-dark-border-secondary">
            <label className="text-sm font-semibold text-dark-text-primary block mb-4">Profile Photo</label>
            <CldUploadWidget
              uploadPreset="school"
              onSuccess={(result, { widget }) => {
                setImg(result.info);
                widget.close();
              }}
            >
              {({ open }) => {
                return (
                  <div
                    className="border-2 border-dashed border-dark-border-secondary hover:border-brand-primary transition-all duration-300 rounded-2xl p-8 cursor-pointer group bg-dark-elevated/50 hover:bg-dark-elevated/70 backdrop-blur-xl"
                    onClick={() => open()}
                  >
                    <div className="flex flex-col items-center gap-4 text-center">
                      <div className="w-16 h-16 bg-dark-elevated group-hover:bg-gradient-to-r group-hover:from-brand-primary group-hover:to-brand-secondary rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl">
                        <svg className="w-8 h-8 text-dark-text-secondary group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark-text-primary group-hover:text-brand-primary transition-colors duration-300">
                          {img ? 'Photo uploaded! Click to change' : 'Upload teacher photo'}
                        </p>
                        <p className="text-xs text-dark-text-secondary mt-2">
                          Drag and drop or click to browse
                        </p>
                      </div>
                      {img && (
                        <div className="text-xs text-status-success-text bg-status-success-bg border border-status-success-border rounded-xl px-4 py-2">
                          ✅ Photo ready for upload
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>
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
            <p className="text-sm text-status-error-text/80 mt-1">Something went wrong while {type === "create" ? "creating" : "updating"} the teacher. Please try again.</p>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type === "create" ? "M12 6v6m0 0v6m0-6h6m-6 0H6" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
          </svg>
          <span>{type === "create" ? "Create Teacher" : "Update Teacher"}</span>
        </button>
      </div>
    </form>
  );
};

export default TeacherForm;
