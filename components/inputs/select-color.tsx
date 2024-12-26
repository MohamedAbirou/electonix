"use client";

import { ImageType } from "@/types";
import { truncateText } from "@/utils/truncate-text";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import { SelectImage } from "./select-image";

interface SelectColorProps {
  item: ImageType;
  addImageToState: (value: ImageType) => void;
  removeImageFromState: (value: ImageType) => void;
  isProductCreated?: boolean;
  isProductUpdated: boolean;
}

export const SelectColor = ({
  item,
  addImageToState,
  removeImageFromState,
  isProductCreated,
  isProductUpdated,
}: SelectColorProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (isProductCreated) {
      setIsSelected(false);
      setFile(null);
    }

    if (isProductUpdated) {
      setIsSelected(item.image ? true : false);
      setFile(item.image);
    }
  }, [isProductCreated, isProductUpdated, item]);

  const handleFileChange = useCallback(
    (value: File) => {
      setFile(value);
      addImageToState({ ...item, image: value });
    },
    [addImageToState, item]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsSelected(e.target.checked);

      if (!e.target.checked) {
        setFile(null);
        removeImageFromState(item);
      }
    },
    [item, removeImageFromState]
  );

  return (
    <div className="grid grid-cols-1 overflow-y-auto border-b-[1.2px] border-sky-200 items-center p-2">
      <div className="flex gap-2 items-center h-[60px]">
        <input
          id={item.color}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheck}
          className="cursor-pointer"
        />
        <label htmlFor={item.color} className="font-medium cursor-pointer">
          {item.color}
        </label>
      </div>
      <>
        {isSelected && !file && (
          <div className="col-span-2 text-center">
            <SelectImage item={item} handleFileChange={handleFileChange} />
          </div>
        )}
        {file && (
          <div className="flex gap-2 text-sm col-span-2 items-center justify-between">
            <p>{truncateText(file.name)}</p>
            <div className="w-[70px]">
              <Button
                label="Cancel"
                small
                outline
                onClick={() => {
                  setFile(null);
                  removeImageFromState(item);
                }}
              />
            </div>
          </div>
        )}
      </>
    </div>
  );
};
