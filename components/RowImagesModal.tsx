"use client";

import { X, FileText } from "lucide-react";
import { useEffect, useCallback } from "react";
import { ImageCard } from "./DocsUploadedModal";

export type RowImagesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  rowData: any;
};

export function RowImagesModal({ isOpen, onClose, rowData }: RowImagesModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !rowData) return null;

  const fw = rowData.factory_wastage_image_url;
  const weightPhoto = rowData.photo_url;

  const renderContent = () => {
    if (!fw && !weightPhoto) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 h-full">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#EBEBEB]">
            <FileText className="w-6 h-6 text-[#A1A1AA]" />
          </div>
          <p className="text-[14px] font-medium text-[#5C5C5C]">No images uploaded for this coil.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {fw ? (
          <ImageCard url={fw} title="Factory Wastage" />
        ) : (
          <EmptySlot title="Factory Wastage" />
        )}
        {weightPhoto ? (
          <ImageCard url={weightPhoto} title="Weight After Metallisation" />
        ) : (
          <EmptySlot title="Weight After Metallisation" />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-[16px] w-full max-w-[600px] shadow-lg flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#EBEBEB]">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] md:text-[22px] leading-tight font-semibold text-[#171717]">Coil Images</h2>
            <p className="text-[11px] md:text-[14px] text-[#5C5C5C]">Coil No: {rowData.metallisation_no || rowData.coilNo || "-"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto bg-[#FAFCFF] min-h-[250px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function EmptySlot({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-[8px] border border-[#EBEBEB] border-dashed shadow-sm bg-[#FAFAFA] aspect-video flex flex-col items-center justify-center text-center px-4">
        <FileText className="w-6 h-6 text-[#A1A1AA] mb-2" />
        <span className="text-[13px] font-medium text-[#5C5C5C]">Not uploaded</span>
      </div>
      <div className="flex flex-col px-1">
        <span className="text-[13px] font-medium text-[#171717]">{title}</span>
      </div>
    </div>
  );
}
