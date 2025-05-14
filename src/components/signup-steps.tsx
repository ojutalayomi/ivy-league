import React, { useState } from 'react';
import { UseFormWatch, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSchemaType } from '@/lib/types';
import { EyeOff, Eye, CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface StepProps {
  register: UseFormRegister<FormSchemaType>;
  errors: FieldErrors<FormSchemaType>;
  watch: UseFormWatch<FormSchemaType>;
}

export const Step1: React.FC<StepProps> = ({ register, errors }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPassword1, setShowPassword1] = useState<boolean>(false)
  return (
    <div className="space-y-4">
      <div>
        <Label className='text-white sm:text-cyan-500' htmlFor="title">Title</Label>
        <Select onValueChange={(value) => register('title').onChange({ target: { value, name: 'title' } })}>
          <SelectTrigger className="text-white placeholder:text-white sm:text-primary sm:placeholder:text-primary">
            <SelectValue placeholder="Select a title" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mr">Mr</SelectItem>
            <SelectItem value="Mrs">Mrs</SelectItem>
            <SelectItem value="Miss">Miss</SelectItem>
          </SelectContent>
        </Select>
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label className='text-white sm:text-cyan-500' htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            {...register('firstname')}
            className="text-white placeholder:text-white sm:text-primary sm:placeholder:text-primary"
            placeholder="John"
          />
          {errors.firstname && (
            <p className="text-sm text-red-500 mt-1">{errors.firstname.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Label className='text-white sm:text-cyan-500' htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            {...register('lastname')}
            className="text-white placeholder:text-white sm:text-primary sm:placeholder:text-primary"
            placeholder="Doe"
          />
          {errors.lastname && (
            <p className="text-sm text-red-500 mt-1">{errors.lastname.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label className='text-white sm:text-cyan-500' htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className="text-white placeholder:text-white sm:text-primary sm:placeholder:text-primary"
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className='flex gap-4'>
        <div>
          <Label className='text-white sm:text-cyan-500' htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className="text-white placeholder:text-white sm:text-primary sm:placeholder:text-primary"
            placeholder="(123) 456-7890"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <Label className='text-white sm:text-cyan-500' htmlFor="dob">Date of Birth</Label><br/>
          <DatePicker register={register}/>
          {errors.dob && (
            <p className="text-sm text-red-500 mt-1">{errors.dob.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label className='text-white sm:text-cyan-500' htmlFor="password">Password</Label>
        <div className='relative'>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register('password')}
            className="text-white placeholder:text-white sm:text-primary sm:placeholder:text-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label className='text-white sm:text-cyan-500' htmlFor="confirmPassword">Confirm Password</Label>
        <div className='relative'>
          <Input
          id="confirmPassword"
          type={showPassword1 ? "text" : "password"}
          {...register('confirmPassword')}
          className="text-white placeholder:text-white sm:text-primary sm:placeholder:text-primary"
          placeholder="Confirm Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword1(!showPassword1)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword1 ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  )
};
  

export function DatePicker({ register }: { register: UseFormRegister<FormSchemaType> }) {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal truncate bg-cyan-500 hover:bg-cyan-400 text-white border-none sm-border",
            !date && "bg-cyan-600"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single" 
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            if (newDate) {
              register('dob').onChange({
                target: { value: newDate.toISOString(), name: 'dob' }
              });
            }
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}