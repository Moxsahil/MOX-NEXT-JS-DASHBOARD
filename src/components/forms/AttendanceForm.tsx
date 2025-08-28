"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect } from "react";
import { attendanceSchema, AttendanceSchema } from "@/lib/formValidationSchemas";
import { createAttendance, updateAttendance } from "@/lib/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AttendanceForm = ({
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
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createAttendance : updateAttendance,
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
      toast(`Attendance has been ${type === "create" ? "recorded" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { students, lessons } = relatedData || {};

  return (
    <form className="space-y-8 bg-dark-secondary/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-dark-border-primary" onSubmit={onSubmit}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent-emerald to-accent-lime rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            {type === "create" ? "Record Attendance" : "Update Attendance"}
          </h1>
          <p className="text-dark-text-secondary font-medium">
            {type === "create" 
              ? "Mark student attendance for lessons" 
              : "Update student attendance record"
            }
          </p>
        </div>
      </div>

      {/* Attendance Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Attendance Details</h3>
        </div>
        <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              label="Date"
              name="date"
              type="date"
              defaultValue={data?.date}
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
            
            {/* Student Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1">
                Student <span className="text-status-error-primary text-xs">*</span>
              </label>
              <select
                className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-300 text-sm font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.studentId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("studentId")}
                defaultValue={data?.studentId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select student...</option>
                {students?.map((student: { id: string; name: string; surname: string }) => (
                  <option value={student.id} key={student.id} className="bg-dark-secondary text-dark-text-primary">
                    {student.name} {student.surname}
                  </option>
                ))}
              </select>
              {errors.studentId?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.studentId.message.toString()}</span>
                </div>
              )}
            </div>

            {/* Lesson Select */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1">
                Lesson <span className="text-dark-text-tertiary text-xs">(optional)</span>
              </label>
              <select
                className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-300 text-sm font-medium bg-dark-tertiary/80 backdrop-blur-xl text-dark-text-primary ${
                  errors.lessonId
                    ? 'border-status-error-primary focus:border-status-error-primary focus:ring-2 focus:ring-status-error-primary/30 shadow-lg shadow-red-500/10'
                    : 'border-dark-border-secondary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30 hover:border-dark-border-accent hover:bg-dark-tertiary shadow-xl'
                }`}
                {...register("lessonId")}
                defaultValue={data?.lessonId}
              >
                <option value="" className="bg-dark-secondary text-dark-text-primary">Select lesson (optional)...</option>
                {lessons?.map((lesson: { id: number; name: string }) => (
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

      {/* Attendance Status Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-secondary-primary to-secondary-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-dark-text-primary">Attendance Status</h3>
        </div>
        <div className="bg-dark-tertiary/60 border border-dark-border-secondary rounded-2xl p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 gap-6">
            {/* Present Status */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-dark-text-primary flex items-center gap-1">
                Status <span className="text-status-error-primary text-xs">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors">
                  <input
                    type="radio"
                    {...register("present")}
                    value="true"
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-green-800">Present</span>
                    </div>
                    <div className="text-xs text-green-600">Student attended</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 transition-colors">
                  <input
                    type="radio"
                    {...register("present")}
                    value="false"
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-red-800">Absent</span>
                    </div>
                    <div className="text-xs text-red-600">Student was absent</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-colors">
                  <input
                    type="radio"
                    {...register("present")}
                    value="late"
                    className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 focus:ring-yellow-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-yellow-800">Late</span>
                    </div>
                    <div className="text-xs text-yellow-600">Student was late</div>
                  </div>
                </label>
              </div>
              {errors.present?.message && (
                <div className="flex items-center gap-2 text-xs text-status-error-text bg-status-error-bg border border-status-error-border rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{errors.present.message.toString()}</span>
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
            <p className="text-sm text-status-error-text/80">Something went wrong while {type === "create" ? "recording" : "updating"} the attendance. Please try again.</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Record Attendance</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Update Attendance</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AttendanceForm;