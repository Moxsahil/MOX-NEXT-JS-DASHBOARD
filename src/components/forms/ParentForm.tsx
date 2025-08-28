"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { parentSchema, ParentSchema } from "@/lib/formValidationSchemas";
import { createParent, updateParent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

const ParentForm = ({
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
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });
 
  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction({...data});
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students } = relatedData;

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent-rose to-accent-pink rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {type === "create" ? "Create New Parent" : "Update Parent"}
        </h1>
        <p className="text-dark-text-secondary font-medium">
          {type === "create" 
            ? "Add a new parent to your school system" 
            : "Update parent information and student connections"
          }
        </p>
      </div>

      {/* Authentication Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              placeholder="parent@email.com"
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
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              placeholder="Enter first name"
            />
            <InputField
              label="Last Name"
              name="surname"
              defaultValue={data?.surname}
              register={register}
              error={errors.surname}
              required
              placeholder="Enter last name"
            />
            <InputField
              label="Phone"
              name="phone"
              type="tel"
              defaultValue={data?.phone}
              register={register}
              error={errors.phone}
              placeholder="Enter phone number"
            />
            <InputField
              label="Address"
              name="address"
              defaultValue={data?.address}
              register={register}
              error={errors.address}
              placeholder="Enter home address"
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

      {/* Students Connection Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-emerald to-accent-teal rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Student Connections</h3>
        </div>
        <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-8">
            {/* Students Multi-select */}
            <div className="flex flex-col gap-4">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-2">Connected Students</label>
              <select
                multiple
                className={`w-full px-5 py-4 rounded-xl border transition-all duration-300 text-base font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary min-h-[140px] ${
                  errors.students
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("students")}
                defaultValue={data?.students}
              >
                {students?.map((student: { id: string; name: string }) => (
                  <option value={student.id} key={student.id} className="py-2 bg-dark-secondary text-dark-text-primary">
                    {student.name}
                  </option>
                )) || (
                  <option disabled className="py-2 bg-dark-secondary text-dark-text-tertiary">
                    No students available
                  </option>
                )}
              </select>
              {errors.students?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.students.message.toString()}</span>
                </div>
              )}
              <p className="text-xs text-dark-text-tertiary mt-1">
                Hold Ctrl (Cmd on Mac) to select multiple students
              </p>
            </div>
          </div>
          
          {/* Info Box */}
          <div className="mt-4 p-4 bg-accent-emerald/10 border border-accent-emerald/20 rounded-xl backdrop-blur-xl">
            <div className="flex items-center gap-2 text-sm text-dark-text-primary">
              <svg className="w-4 h-4 text-accent-emerald" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                Parents can be connected to multiple students. This allows them to monitor all their children's progress.
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
            <p className="text-sm text-status-error-text/80">Something went wrong while {type === "create" ? "creating" : "updating"} the parent. Please try again.</p>
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
              Create Parent
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Parent
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ParentForm;
