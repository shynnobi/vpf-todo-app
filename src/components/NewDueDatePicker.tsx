import DatePicker from '@/components/date-picker/date-picker';

interface NewDueDatePickerProps {
	value?: Date;
	onChange: (date?: Date) => void;
}

export function NewDueDatePicker({ value, onChange }: NewDueDatePickerProps) {
	return <DatePicker value={value} onChange={onChange} placeholder="Due date" />;
}
