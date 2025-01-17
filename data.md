"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {  createResult, updateResult } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ResultForm = ({
    type,
    data,
    setOpen,
    relatedData,
  }: {
    type: "create" | "update";
    data?: ResultSchema;
    setOpen: Dispatch<SetStateAction<boolean>>;
    relatedData?: { 
      students: { id: number; name: string }[], 
      exams: { id: number; title: string }[], 
      assignments: { id: number; title: string }[] 
    };
  }) => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ResultSchema>({
      resolver: zodResolver(resultSchema),
      defaultValues: data,
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
      formAction({
        ...data,
      });
      console.log()
    });
  
    const router = useRouter();
  
    useEffect(() => {
      if (state.success) {
        toast(
          `Result has been ${type === "create" ? "created" : "updated"}!`
        );
        setOpen(false);
        router.refresh();
      }
    }, [state, router, type, setOpen]);
  
    const { students, exams, assignments } = relatedData || { classes: [], students: [], exams: [], assignments: [] };
  
    return (
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create a new result" : "Update the result"}
        </h1>
  
        <div className="flex justify-between flex-wrap gap-4">
          <InputField
            label="Score"
            name="score"
            type="number"
            register={register}
            error={errors?.score}
          />
        </div>
  
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            {students.map((student) => (
              <option value={student.id} key={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">{errors.studentId.message}</p>
          )}
        </div>
  
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Exam</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId")}
            defaultValue={data?.examId}
          >
            <option value="">None</option>
            {exams?.map((exam) => (
              <option value={exam.id} key={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>
  
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId")}
            defaultValue={data?.assignmentId}
          >
            <option value="">None</option>
            {assignments?.map((assignment) => (
              <option value={assignment.id} key={assignment.id}>
                {assignment.title}
              </option>
            ))}
          </select>
        </div>
  
        {state.error && (
          <span className="text-red-500">Something went wrong!</span>
        )}
  
        <button className="bg-blue-400 text-white p-2 rounded-md">
          {type === "create" ? "Create" : "Update"}
        </button>
      </form>
    );
  };
  
  export default ResultForm;
