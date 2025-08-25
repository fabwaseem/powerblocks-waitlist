import { copyToClipboard } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

const CopyButton = ({ text }: { text?: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    copyToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <button className="p-1 cursor-pointer" onClick={handleCopy}>
      {isCopied ? (
        <Check className="w-4 h-4 text-[#A5A9C1]" />
      ) : (
        <Copy className="w-4 h-4 text-[#A5A9C1]" />
      )}
    </button>
  );
};

export default CopyButton;
