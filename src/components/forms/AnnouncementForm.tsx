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
      formAction({...data, ...formData});
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
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold">
          {type === "create" ? "Create a new announcement" : "Update the announcement"}
        </h1>
        <div className="flex justify-between flex-wrap gap-4">
          <InputField
            label="Title"
            name="title"
            register={register}
            error={errors?.title}
          />
          <InputField
            label="Description"
            name="description"
            register={register}
            error={errors?.description}
          />
          <InputField
            label="Date"
            name="date"
            type="date"
            register={register}
            error={errors?.date}
          />
        </div>
  
        <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Class</label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("classId")}
          defaultValue={data?.classId}
        >
          {classes.map((classItem: { id: number; name: string }) => (
            <option value={classItem.id} key={classItem.id}>
              {classItem.name}
            </option>
          ))}
        </select>
        {errors.classId?.message && (
          <p className="text-xs text-red-400">{errors.classId.message}</p>
        )}
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
  
  export default AnnouncementForm;
