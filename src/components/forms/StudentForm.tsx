"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  studentSchema,
  StudentSchema,
  teacherSchema,
  TeacherSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {
  createStudent,
  createTeacher,
  updateStudent,
  updateTeacher,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";

const StudentForm = ({
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();

  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("hello");
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { grades, classes, parents } = relatedData;

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {type === "create" ? "Create New Student" : "Update Student"}
        </h1>
        <p className="text-dark-text-secondary font-medium">
          {type === "create" 
            ? "Add a new student to your school system" 
            : "Update student information and settings"
          }
        </p>
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
              placeholder="student@school.com"
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
          {/* Photo Upload */}
          <div className="col-span-full">
            <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1 block mb-3">Profile Photo</label>
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
                    className="border-2 border-dashed border-dark-border-secondary hover:border-brand-primary transition-colors duration-300 rounded-xl p-6 cursor-pointer group bg-dark-tertiary/40 backdrop-blur-xl"
                    onClick={() => open()}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 bg-dark-secondary/80 group-hover:bg-brand-primary/20 rounded-full flex items-center justify-center transition-colors duration-300 border border-dark-border-secondary">
                        <svg className="w-6 h-6 text-dark-text-secondary group-hover:text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-dark-text-primary group-hover:text-brand-primary transition-colors duration-300">
                          {img ? 'Photo uploaded! Click to change' : 'Upload student photo'}
                        </p>
                        <p className="text-xs text-dark-text-tertiary mt-1">
                          Drag and drop or click to browse
                        </p>
                      </div>
                      {img && (
                        <div className="text-xs text-status-success-text bg-status-success-bg border border-status-success-border rounded-lg px-3 py-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Photo ready for upload
                        </div>
                      )}
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>
          </div>
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
            {/* Parent Select */}
            <div className="flex flex-col gap-4 w-full">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-2">
                Parent/Guardian <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.parentId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("parentId")}
                defaultValue={data?.parentId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select parent/guardian...</option>
                {parents?.map((parent: { id: string; name: string; surname: string }) => (
                  <option value={parent.id} key={parent.id} className="bg-dark-secondary text-dark-text-primary">
                    {parent.name} {parent.surname}
                  </option>
                ))}
              </select>
              {errors.parentId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.parentId.message.toString()}</span>
                </div>
              )}
              {(!parents || parents.length === 0) && (
                <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>No parents found. Please create parents first before adding students.</span>
                </div>
              )}
            </div>
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
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select gender...</option>
                <option value="MALE" className="bg-dark-secondary text-dark-text-primary">Male</option>
                <option value="FEMALE" className="bg-dark-secondary text-dark-text-primary">Female</option>
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
            
            {/* Grade Select */}
            <div className="flex flex-col gap-4 w-full">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-2">
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
            
            {/* Class Select */}
            <div className="flex flex-col gap-4 w-full">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-2">
                Class <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.classId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("classId")}
                defaultValue={data?.classId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select class...</option>
                {classes.map(
                  (classItem: {
                    id: number;
                    name: string;
                    capacity: number;
                    _count: { students: number };
                  }) => (
                    <option value={classItem.id} key={classItem.id} className="bg-dark-secondary text-dark-text-primary">
                      {classItem.name} - {classItem._count.students}/{classItem.capacity} students
                    </option>
                  )
                )}
              </select>
              {errors.classId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.classId.message.toString()}</span>
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
            <p className="text-sm text-status-error-text/80">Something went wrong while {type === "create" ? "creating" : "updating"} the student. Please try again.</p>
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
              Create Student
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Student
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
