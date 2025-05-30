import { useState, useEffect, useRef, ChangeEvent } from 'react';

interface EditableSelectProps {
  defaultValue?: number;
  options: number[];
  placeholder?: string;
  onChange?: (value: number | string) => void;
}

const EditableSelect: React.FC<EditableSelectProps> = ({
  defaultValue = '',
  options,
  placeholder = '请选择或输入',
  onChange,
}) => {
  const [value, setValue] = useState<number | string>(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    onChange?.(inputValue);
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    onChange?.(selectedValue);
  };

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={handleSelectChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        className="absolute inset-y-0 left-0 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default EditableSelect;
