import { AuthFormSchema } from '@/lib/utils';
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
}
const CustomInput = ({
  control,
  name,
  placeholder,
  label,
}: CustomInputProps) => {
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
                type={name === 'password' ? 'password' : 'text'}
                placeholder={placeholder}
                {...field}
                id={field.name}
                className='input-class'
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
