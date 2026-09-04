import Label from "./Label";
import { useEffect, useState } from "react";
import flatpickr from "flatpickr";
import Hook = flatpickr.Options.Hook;
import "flatpickr/dist/flatpickr.css";
import { CalenderIcon } from "../../icons";
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
  value?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  value
}: PropsType) {
  // `static: true` drops the calendar into the page next to its input rather
  // than on `document.body`, so it competes for stacking order with whatever
  // comes after it — and the fields below, which paint their own layer for the
  // backdrop blur, win. Lifting only the OPEN picker keeps the calendar on top
  // without letting a later picker's input cover an earlier one's calendar.
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate,
      onChange,
      onOpen: () => setIsOpen(true),
      onClose: () => setIsOpen(false),
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className={`relative ${isOpen ? "z-[60]" : ""}`}>
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border appearance-none px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-4 dark:bg-gray-900/60 dark:text-white/90 dark:placeholder:text-white/30 bg-white/70 backdrop-blur text-gray-800 border-gray-200 hover:border-gray-300 focus:border-brand-400 focus:ring-brand-500/15 dark:border-white/10 dark:hover:border-white/20 dark:focus:border-brand-500"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}
