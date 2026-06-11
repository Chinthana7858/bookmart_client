import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownSelectProps = {
  label?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
};

export function DropdownSelect({
  label = "Select",
  value,
  options,
  onChange,
  className = "",
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    options.find((option) => option.value === value)?.label || label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-11 w-full cursor-pointer items-center justify-between rounded-md border border-orange-200 px-4 py-2.5 text-sm font-medium leading-5 shadow-sm transition focus:outline-none focus:ring-4 focus:ring-orange-200"
      >
        <span className="truncate">{selectedLabel}</span>
        <FiChevronDown className="ms-1.5 h-4 w-4 flex-none" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 max-h-72 w-full min-w-44 overflow-y-auto rounded-md border border-orange-100 bg-white shadow-lg">
          <ul className="p-2 text-sm font-medium text-stone-700">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`inline-flex w-full cursor-pointer items-center rounded p-2 text-left hover:bg-secondary hover:text-primarydark ${
                    value === option.value ? "bg-secondary text-primarydark" : ""
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search",
  className = "",
}: SearchBarProps) {
  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        onSearch?.();
      }}
    >
      <label htmlFor="bookmart-search" className="sr-only mb-2.5 block text-sm font-medium">
        Search
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <FiSearch className="h-4 w-4 text-stone-500" />
        </div>
        <input
          type="search"
          id="bookmart-search"
          className="block h-11 w-full rounded-md border border-orange-100 bg-white p-3 ps-9 text-sm text-stone-900 shadow-sm placeholder:text-stone-500 focus:border-primary focus:ring-primary"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="submit"
          className="absolute bottom-1.5 end-1.5 inline-flex cursor-pointer items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium leading-5 text-white shadow-sm transition hover:bg-primarydark focus:outline-none focus:ring-4 focus:ring-orange-200"
        >
          <FiSearch size={13} />
          Search
        </button>
      </div>
    </form>
  );
}

type CheckboxOption = {
  label: string;
  value: string;
};

type CheckboxGroupProps = {
  label: string;
  values: string[];
  options: CheckboxOption[];
  onChange: (values: string[]) => void;
  className?: string;
};

export function CheckboxGroup({
  label,
  values,
  options,
  onChange,
  className = "",
}: CheckboxGroupProps) {
  const toggleValue = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((selected) => selected !== value)
        : [...values, value]
    );
  };

  return (
    <fieldset className={className}>
      <legend className="mb-2 text-sm font-semibold text-stone-700">{label}</legend>
      <div className="grid max-h-40 gap-2 overflow-y-auto rounded-md border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-stone-700 transition hover:bg-secondary hover:text-primarydark"
          >
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => toggleValue(option.value)}
              className="h-4 w-4 rounded border-stone-300 text-primary focus:ring-primary"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
