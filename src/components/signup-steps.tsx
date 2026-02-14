import React, { useState, useEffect } from 'react';
import { UseFormWatch, UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSchemaType } from '@/lib/types';
import { EyeOff, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker as AntdDatePicker } from "antd";
import dayjs from 'dayjs';

interface StepProps {
  register: UseFormRegister<FormSchemaType>;
  errors: FieldErrors<FormSchemaType>;
  watch: UseFormWatch<FormSchemaType>;
  setValue: UseFormSetValue<FormSchemaType>;
}

export const StepPersonal: React.FC<StepProps> = ({ register, errors }) => {
  return (
    <div className="space-y-2.5">
      <div className='space-y-1'>
        <Label className='sm:text-cyan-500' htmlFor="title">Title</Label>
        <Select onValueChange={(value) => register('title').onChange({ target: { value, name: 'title' } })}>
          <SelectTrigger className="sm:text-primary sm:placeholder:text-primary/50 dark:border-slate-700">
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
        <div className="flex-1 space-y-1">
          <Label className='sm:text-cyan-500' htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            {...register('firstname')}
            className="sm:text-primary sm:placeholder:text-primary/50 dark:border-slate-700"
            placeholder="John"
          />
          {errors.firstname && (
            <p className="text-sm text-red-500 mt-1">{errors.firstname.message}</p>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <Label className='sm:text-cyan-500' htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            {...register('lastname')}
            className="sm:text-primary sm:placeholder:text-primary/50 dark:border-slate-700"
            placeholder="Doe"
          />
          {errors.lastname && (
            <p className="text-sm text-red-500 mt-1">{errors.lastname.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const StepContact: React.FC<StepProps> = ({ register, errors, watch, setValue }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ant-picker-input input {
        color: #000;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    }
  }, []);

  return (
    <div className="space-y-2.5">
      <div className='space-y-1'>
        <Label className='sm:text-cyan-500' htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className="sm:text-primary sm:placeholder:text-primary/50 dark:border-slate-700"
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className='flex gap-4'>
        <div className='flex-1 space-y-1'>
          <Label className='sm:text-cyan-500' htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            onChange={(e) => setValue('phone', e.target.value)}
            value={watch('phone')}
            className="sm:text-primary sm:placeholder:text-primary/50 dark:border-slate-700"
            placeholder="0801 234 5678"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
        <div className='flex-1 space-y-1'>
          <Label className='sm:text-cyan-500' htmlFor="dob">Date of Birth</Label><br/>
          <AntdDatePicker
            className={`h-9 sm:text-primary sm:placeholder:!text-primary/50`}
            id="dob"
            value={watch('dob') ? dayjs(watch('dob')) : null}
            onChange={(date) => setValue('dob', date?.format('YYYY-MM-DD'))}
            picker="date"
            placeholder="Select your date of birth"
            format="YYYY-MM-DD"
            allowClear
            style={{
              width: "100%",
              backgroundColor: typeof window !== "undefined" && window.document.documentElement.classList.contains('dark') ? '#00000000' : 'white',
              color: typeof window !== "undefined" && window.document.documentElement.classList.contains('dark') ? '#fff' : '#000',
              borderColor: typeof window !== "undefined" && window.document.documentElement.classList.contains('dark') ? '#334155' : undefined
            }}
            minDate={dayjs('1960-01-01')}
            maxDate={dayjs('2010-12-31')}
            disabledDate={current =>
              current && (dayjs(current).isAfter(dayjs('2010-12-31')) || dayjs(current).isBefore(dayjs('1980-01-01')))
            }
            inputReadOnly
          />
          {errors.dob && (
            <p className="text-sm text-red-500 mt-1">{errors.dob.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const StepSecurity: React.FC<StepProps> = ({ register, errors }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword1, setShowPassword1] = useState<boolean>(false);

  return (
    <div className="space-y-2.5">
      <div className='space-y-1'>
        <Label className='sm:text-cyan-500' htmlFor="password">Password</Label>
        <div className='relative'>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register('password')}
            className="sm:text-primary sm:placeholder:text-primary/50 dark:border-slate-700"
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
      <div className='space-y-1'>
        <Label className='sm:text-cyan-500' htmlFor="confirmPassword">Confirm Password</Label>
        <div className='relative'>
          <Input
            id="confirmPassword"
            type={showPassword1 ? "text" : "password"}
            {...register('confirmPassword')}
            className="sm:text-primary sm:placeholder:text-primary/50 dark:border-slate-700"
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
  );
};