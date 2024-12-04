import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ConfirmToastProps {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  confirm: string;
  cancel: string;
}

const ConfirmToast: React.FC<ConfirmToastProps> = ({
  onConfirm,
  onCancel,
  message,
  confirm,
  cancel,
}) => {
  return (
    <>
      <div className="flex flex-col">
        <p className="text-slate-700 dark:text-gray-200 font-sans">{message}</p>
        <div className="flex justify-end space-x-2 py-2">
          <button
            onClick={() => {
              onConfirm();
              toast.dismiss();
            }}
            className="
        flex w-16 items-center justify-center px-2 py-1
        rounded-lg font-medium text-sm 
        focus:outline-none
        focus:ring-green-400 focus:ring-1 transition-all
        text-white bg-green-500 hover:bg-green-600 active:bg-green-500
        dark:text-gray-200 dark:bg-green-600 dark:hover:bg-green-500 dark:active:bg-green-600"
          >
            {confirm}
          </button>
          <button
            onClick={() => {
              onCancel();
              toast.dismiss();
            }}
            className="
        flex w-16 items-center justify-center px-2 py-1
        rounded-lg font-medium text-sm
        focus:outline-none
        focus:ring-red-500 focus:ring-1 transition-all
        text-white bg-red-500 hover:bg-red-600 active:bg-red-500
        dark:text-gray-200 dark:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-600
      "
          >
            {cancel}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmToast;
