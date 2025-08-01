import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({
  organization: yup.string().required('Organization is required'),
  description: yup.string().required('Description is required'),
  proof_of_service: yup.string().required('Proof of service is required'),
  start_time: yup.string().required('Start time is required'),
  end_time: yup.string().required('End time is required'),
  date_of_service: yup.date().required('Date of service is required'),
  additional_info: yup.string().optional(),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function VolunteerLogForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      organization: 'Stiles NJHS',
      additional_info: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const { error } = await supabase
        .from('volunteer_log')
        .insert([
          {
            user_id: user.id,
            ...data,
            date_of_service: data.date_of_service.toISOString().split('T')[0], // Store only the date part to avoid timezone issues
          },
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      reset();
      setSelectedDate(new Date());
    } catch (error) {
      setSubmitError('Failed to submit volunteer log. Please try again.');
      console.error('Error submitting volunteer log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-10 max-w-2xl sm:max-w-4xl mx-auto p-4 bg-white rounded-xl sm:rounded-3xl shadow-lg sm:shadow-2 border border-indigo-200 m:border-2">
      <div>
        <label htmlFor="organization" className="block text-base sm:text-lg font-bold text-indigo-900">
          Organization
        </label>
        <input
          type="text"
          id="organization"
          {...register('organization')}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border border-indigo-200 sm:border-2 focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
        />
        {errors.organization && (
          <p className="mt-2 text-sm sm:text-base text-red-600 font-semibold">{errors.organization.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-base sm:text-lg font-bold text-indigo-900">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border border-indigo-200 sm:border-2 focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
        />
        {errors.description && (
          <p className="mt-2 text-sm sm:text-base text-red-600 font-semibold">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="proof_of_service" className="block text-base sm:text-lg font-bold text-indigo-900">
          Proof of Service (Email/Phone)
        </label>
        <input
          type="text"
          id="proof_of_service"
          {...register('proof_of_service')}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border border-indigo-200 sm:border-2 focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
        />
        {errors.proof_of_service && (
          <p className="mt-2 text-sm sm:text-base text-red-600 font-semibold">{errors.proof_of_service.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="start_time" className="block text-base sm:text-lg font-bold text-indigo-900 mb-2">
            Start Time
          </label>
          <input
            type="time"
            id="start_time"
            {...register('start_time')}
            className="mt-1 block w-full rounded-lg sm:rounded-xl border border-indigo-200 sm:border-2 focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
          />
          {errors.start_time && (
            <p className="mt-2 text-sm sm:text-base text-red-600 font-semibold">{errors.start_time.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="end_time" className="block text-base sm:text-lg font-bold text-indigo-900 mb-2">
            End Time
          </label>
          <input
            type="time"
            id="end_time"
            {...register('end_time')}
            className="mt-1 block w-full rounded-lg sm:rounded-xl border border-indigo-200 sm:border-2 focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
          />
          {errors.end_time && (
            <p className="mt-2 text-sm sm:text-base text-red-600 font-semibold">{errors.end_time.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="date_of_service" className="block text-base sm:text-lg font-bold text-indigo-900">
          Date of Service
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setValue('date_of_service', date || new Date());
          }}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border border-indigo-200 sm:border-2 focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
        />
        {errors.date_of_service && (
          <p className="mt-2 text-sm sm:text-base text-red-600 font-semibold">{errors.date_of_service.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="additional_info" className="block text-base sm:text-lg font-bold text-indigo-900">
          Additional Information (Optional)
        </label>
        <textarea
          id="additional_info"
          rows={3}
          {...register('additional_info')}
          className="mt-1 block w-full rounded-lg sm:rounded-xl border border-indigo-200 sm:border-2 focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6"
        />
      </div>

      {submitError && (
        <div className="rounded-lg sm:rounded-xl bg-red-50 p-4 sm:p-6">
          <p className="text-sm sm:text-base text-red-700 font-semibold">{submitError}</p>
        </div>
      )}

      {submitSuccess && (
        <div className="rounded-lg sm:rounded-xl bg-green-50 p-4 sm:p-6">
          <p className="text-sm sm:text-base text-green-700 font-semibold">Volunteer log submitted successfully!</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 sm:py-5 px-6 sm:px-8 border border-transparent rounded-lg sm:rounded-xl shadow-lg text-base sm:text-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Volunteer Log'}
        </button>
      </div>
    </form>
  );
} 