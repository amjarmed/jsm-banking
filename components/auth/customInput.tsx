import { AuthFormSchema, HTMLInputTypes } from '@/lib/utils';
import { Control, FieldPath } from 'react-hook-form';
import { z } from 'zod';
import { FormControl, FormField, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
// to use all the fields in the form
const formSchema = AuthFormSchema('sign-up');
export interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  placeholder: string;
  label: string;
  inputType: HTMLInputTypes;
}
/**
 * CustomInput component renders a form input field with a label and message.
 *
 * This component uses react-hook-form for controlled input handling and
 * integrates with a form schema for validation. It dynamically adjusts
 * the input type based on the field name, such as rendering a password
 * input for fields named 'password'.
 *
 * Props:
 * @param control - The control object from react-hook-form for managing form state.
 * @param name - The name of the form field, used for validation and state management.
 * @param placeholder - The placeholder text for the input field.
 * @param label - The label text displayed above the input field.
 *
 * Returns:
 * A JSX element containing a labeled input field with validation messaging.
 */
const CustomInput = ({
  control,
  name,
  placeholder,
  label,
  inputType,
}: CustomInputProps) => {
  // Define min and max values for date inputs only
  const dateAttributes =
    inputType === 'date'
      ? {
          min: '1950-01-01',
          max: new Date().toISOString().split('T')[0],
        }
      : {};

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className='form-item'>
          <FormLabel className='form-label'>{label}</FormLabel>
          <div className='flex flex-col w-full'>
            <FormControl>
              <Input
                // type={name === 'password' ? 'password' : 'text'}
                type={inputType}
                id={field.name}
                placeholder={placeholder}
                {...field}
                className='input-class'
                {...dateAttributes} // Conditionally spreads min and max only if inputType is "date"
                required
              />
            </FormControl>
            <FormMessage className='form-message mt-2' />
          </div>
        </div>
      )}
    />
  );
};
export default CustomInput;
