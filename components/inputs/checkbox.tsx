"use client";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface CheckboxProps {
  id: string;
  label: string;
  disabled?: boolean;
  register: UseFormRegister<FieldValues>;
}

export const Checkbox = ({ id, label, disabled, register }: CheckboxProps) => {
  return (
    <div className="w-full flex flex-row gap-2 items-center">
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        {...register(id)}
        placeholder=""
        className="cursor-pointer"
      />
      <label htmlFor={id} className="font-medium cursor-pointer">
        {label}
      </label>
    </div>
  );
};
