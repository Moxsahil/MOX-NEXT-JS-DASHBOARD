"use client";

import {
  deleteAnnouncement,
  deleteAssignment,
  deleteAttendance,
  deleteClass,
  deleteEvent,
  deleteExam,
  deleteGrade,
  deleteLesson,
  deleteParent,
  deleteResult,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";
import { createPortal } from "react-dom";


const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
// TODO: OTHER DELETE ACTIONS
  parent: deleteParent,
  lesson: deleteLesson,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
  event: deleteEvent,
  announcement: deleteAnnouncement,
  grade: deleteGrade,
};

// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-dark-border-secondary border-t-brand-primary rounded-full animate-spin"></div>
      <span className="text-dark-text-secondary font-medium">Loading form...</span>
    </div>
  </div>
);

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: LoadingSpinner,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: LoadingSpinner,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: LoadingSpinner,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: LoadingSpinner,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: LoadingSpinner,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: LoadingSpinner,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: LoadingSpinner,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: LoadingSpinner,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: LoadingSpinner,
});
const ResultForm = dynamic(() => import("./forms/ResultForm"), {
  loading: LoadingSpinner,
});
const GradeForm = dynamic(() => import("./forms/GradeForm"), {
  loading: LoadingSpinner,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: LoadingSpinner,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: LoadingSpinner,
});



// TODO: OTHER FORMS

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
    // TODO OTHER LIST ITEMS
  ),
  parent: (setOpen, type, data, relatedData) => (
    <ParentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  lesson: (setOpen, type, data, relatedData) => (
    <LessonForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  result: (setOpen, type, data, relatedData) => (
    <ResultForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  grade: (setOpen, type, data, relatedData) => (
    <GradeForm
      type={type}
      data={data}
    />
  ),
  assignment: (setOpen, type, data, relatedData) => (
    <AssignmentForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  attendance: (setOpen, type, data, relatedData) => (
    <AttendanceForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const buttonConfig = {
    create: {
      size: "w-10 h-10",
      gradient: "bg-gradient-to-r from-accent-emerald to-accent-teal",
      icon: "create",
      label: `Add ${table}`,
      hoverEffect: "hover:scale-110 hover:shadow-glow"
    },
    update: {
      size: "w-8 h-8", 
      gradient: "bg-gradient-to-r from-primary-500 to-primary-400",
      icon: "update",
      label: `Edit ${table}`,
      hoverEffect: "hover:scale-110"
    },
    delete: {
      size: "w-8 h-8",
      gradient: "bg-gradient-to-r from-accent-rose to-accent-pink", 
      icon: "delete",
      label: `Delete ${table}`,
      hoverEffect: "hover:scale-110"
    }
  };
  
  const config = buttonConfig[type];

  const [open, setOpen] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Create portal element
  useEffect(() => {
    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
      modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      modalRoot.style.position = 'fixed';
      modalRoot.style.top = '0';
      modalRoot.style.left = '0';
      modalRoot.style.width = '100%';
      modalRoot.style.height = '100%';
      modalRoot.style.zIndex = '99999';
      modalRoot.style.pointerEvents = 'none';
      document.body.appendChild(modalRoot);
    }
    setPortalElement(modalRoot);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open');
      document.documentElement.style.overflow = 'hidden';
      if (portalElement) {
        portalElement.style.pointerEvents = 'auto';
      }
    } else {
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = 'unset';
      if (portalElement) {
        portalElement.style.pointerEvents = 'none';
      }
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.style.overflow = 'unset';
      if (portalElement) {
        portalElement.style.pointerEvents = 'none';
      }
    };
  }, [open, portalElement]);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <div className="space-y-6">
        {/* Delete Confirmation Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-accent-rose to-accent-pink rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark-text-primary">Delete {table.charAt(0).toUpperCase() + table.slice(1)}</h2>
          <p className="text-dark-text-secondary">This action cannot be undone</p>
        </div>

        {/* Warning Message */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="text-red-400 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-red-400 mb-1">Warning: Permanent deletion</h3>
              <p className="text-red-300 text-sm">
                All data associated with this {table} will be permanently deleted. This action cannot be undone.
                Are you absolutely sure you want to continue?
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <form action={formAction} className="space-y-4">
          <input type="text | number" name="id" value={id} hidden />
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-6 py-3 border border-dark-border-primary text-dark-text-secondary rounded-xl font-semibold hover:bg-dark-elevated/50 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-accent-rose to-accent-pink text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-500 transition-all duration-300 hover:scale-[1.02] shadow-modern hover:shadow-glow flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete {table.charAt(0).toUpperCase() + table.slice(1)}</span>
            </button>
          </div>
        </form>
      </div>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-dark-elevated rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29.82-5.718 2.172M12 2.5a9.963 9.963 0 00-9 5.5c0 3.53 2.164 6.571 5.218 8.5.678.427 1.287.8 1.782 1.085A9.967 9.967 0 0012 19.5z" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-dark-text-primary">Form not found!</p>
        <p className="text-sm text-dark-text-secondary">The requested form type is not available.</p>
      </div>
    );
  };

  return (
    <>
      <button
        className={`${config.size} flex items-center justify-center rounded-xl ${config.gradient} text-white shadow-soft transition-all duration-300 ${config.hoverEffect} group`}
        onClick={() => setOpen(true)}
        title={config.label}
      >
        <Image 
          src={`/${config.icon}.png`} 
          alt={config.label} 
          width={16} 
          height={16} 
          className="group-hover:scale-110 transition-transform duration-200"
        />
      </button>
      
      {open && portalElement && createPortal(
        <div 
          className="modal-overlay fixed inset-0 bg-dark-primary/90 backdrop-blur-md z-[99999] flex items-start justify-center pt-4 pb-4 px-4 animate-fade-in overflow-y-auto"
          style={{ zIndex: 99999, pointerEvents: 'auto' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
            }
          }}
        >
          <div 
            className="modal-content bg-dark-secondary/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-border-primary relative w-full max-w-6xl max-h-[96vh] overflow-hidden animate-scale-in"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#52525b #27272a',
              zIndex: 100000
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-dark-secondary/98 backdrop-blur-xl border-b border-dark-border-primary px-8 py-5 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-dark-text-primary capitalize flex items-center gap-3">
                {type === "create" && (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-success to-accent-emerald rounded-xl flex items-center justify-center shadow-glow">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    Add New {table}
                  </>
                )}
                {type === "update" && (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-glow">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    Edit {table}
                  </>
                )}
                {type === "delete" && (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-accent-rose to-accent-pink rounded-xl flex items-center justify-center shadow-glow">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    Delete {table}
                  </>
                )}
              </h2>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-dark-elevated hover:bg-dark-elevated/80 text-dark-text-secondary hover:text-dark-text-primary transition-all duration-200 group hover:scale-105 shadow-xl"
                onClick={() => setOpen(false)}
                title="Close modal"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(96vh-90px)] px-2 modal-scroll">
              <div className="p-8">
                <Form />
              </div>
            </div>
          </div>
        </div>,
        portalElement
      )}
    </>
  );
};

export default FormModal;
