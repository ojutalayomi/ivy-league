import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Course, courses, students } from '@/lib/data';
import { useEffect, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function CourseRegistration() {
  const navigate = useNavigate();
  const [selectedCourses, setSelectedCourses] = useState<{ [key: string]: boolean }>({});
  const [courseTypes, setCourseTypes] = useState<{ [key: string]: 'standard' | 'intensive' }>({});
  const [email, setEmail] = useState('');
  const [paymentType, setPaymentType] = useState<'partial' | 'full'>('full');
  const [searchParams, setSearchParams] = useSearchParams();

  const totalAmount = courses.reduce((total, course) => {
    if (selectedCourses[course.code]) {
      const price = course.price + (course.revisionPrice || 0);
      return total + price;
    }
    return total;
  }, 0);

  useEffect(() => {
    setEmail(students[0].email);
    // console.log(courses.map(course => course.name + '(' + course.code + ')').join(', '))
  }, []);

  useEffect(() => {
    if (searchParams.get('paymentSummary') === 'true' && totalAmount === 0) {
      navigate(-1);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Please select at least one course'
      })
    }
  }, [searchParams, navigate, totalAmount]);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: totalAmount * 100, // Convert to kobo
    publicKey: 'pk_test_ff43329c90b3e15a51dddfb44ddc03c9464740b4',
  };

  const calculatePrices = (cs: string[] | string) => {
    if (typeof cs === 'string') {
      const price = courses.find(c => c.code === cs)?.price || 0;
      return price + (courses.find(c => c.code === cs)?.revisionPrice || 0);
    }
    return cs.map(i => courses.find(c => `${c.name}(${c.code})` === i)?.price || 0).reduce((total, invoice) => total + invoice, 0)
  }


  const initializePayment = usePaystackPayment(config);

  const handleSuccess = () => {
    toast({
      variant: 'success',
      title: "Success!", 
      description: 'Payment successful! Thank you for your registration.'
    })
    setSelectedCourses({});
    setCourseTypes({});
    setEmail('');
  };

  const handleClose = () => {
    toast({
      variant: 'destructive',
      title: "Oops!", 
      description: 'Payment closed'
    })
  };

  const groupedCourses = courses.reduce((acc, course) => {
    if (!acc[course.category]) {
      acc[course.category] = [];
    }
    acc[course.category].push(course);
    return acc;
  }, {} as { [key: string]: Course[] });

  return (
    <div className="space-y-4">
      
      <div className="max-w-6xl mx-auto rounded-lg">
        {Object.entries(groupedCourses).map(([category, categoryCourses]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:items-start gap-4">
              {categoryCourses.map((course) => (
                <div key={course.code} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                  <label className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      checked={!!selectedCourses[course.code]}
                      onChange={(e) => {
                        setSelectedCourses({
                          ...selectedCourses,
                          [course.code]: e.target.checked
                        })
                        setCourseTypes({
                          ...courseTypes,
                          [course.code]: courseTypes[course.code] || 'standard'
                        })
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                    <span className="flex-1">
                      <span className="block font-medium text-gray-700 dark:text-gray-200">{course.name} ({course.code})</span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        Standard: ₦{course.price.toLocaleString()}
                        {course.price && ` | Intensive: ₦${course.price.toLocaleString()}`}
                      </span>
                    </span>
                  </label>
                  
                  {course.price && selectedCourses[course.code] && (
                    <div className="mt-2 ml-8">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`course-type-${course.code}`}
                            checked={courseTypes[course.code] === 'standard'}
                            onChange={() => setCourseTypes({
                              ...courseTypes,
                              [course.code]: 'standard'
                            })}
                            className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Standard</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`course-type-${course.code}`}
                            checked={courseTypes[course.code] === 'intensive'}
                            onChange={() => setCourseTypes({
                              ...courseTypes,
                              [course.code]: 'intensive'
                            })}
                            className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Intensive</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="m-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Total Amount: ₦{totalAmount.toLocaleString()}
            </div>
            
            <Input
              disabled
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded-md w-full max-w-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
              required
            />

            <Button
              onClick={() => {
                if (!email) return toast({
                  variant: 'destructive', 
                  title: "Oops!",
                  description: 'Please enter your email address'
                });
                if (totalAmount === 0) return toast({
                  variant: 'destructive',
                  title: "Oops!",
                  description: 'Please select at least one course'
                });
                setSearchParams({paymentSummary: 'true'});
              }}
              disabled={totalAmount === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full max-w-md"
            >
              {totalAmount === 0 ? 'Select a course to proceed' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>

        <Dialog open={searchParams.get('paymentSummary') === 'true' && totalAmount !== 0} onOpenChange={() => navigate(-1)}>
          <DialogContent className='dark:bg-gray-900 h-screen w-screen md:max-w-[calc(100vw-68px)] md:h-auto'>
            <DialogHeader className='space-y-4'>
              <DialogTitle className='text-2xl font-bold text-center text-gray-800 dark:text-gray-100'>Payment Summary</DialogTitle>
              <DialogDescription className='text-center text-gray-600 dark:text-gray-400'>
                Review your selected courses and payment details before proceeding
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 overflow-auto md:max-h-[70vh]">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <Table>
                  <TableCaption className='text-gray-500 dark:text-gray-400'>Course selection details and pricing</TableCaption>
                  <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                      <TableHead className='font-semibold'>Course Code</TableHead>
                      <TableHead className='font-semibold'>Course Name</TableHead>
                      <TableHead className='font-semibold'>Type</TableHead>
                      <TableHead className='font-semibold text-right'>Amount (₦)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(selectedCourses)
                      .filter(([, isSelected]) => isSelected)
                      .map(([courseCode]) => {
                        const course = courses.find(c => c.code === courseCode);
                        return (
                          <TableRow key={courseCode} className='hover:bg-gray-100 dark:hover:bg-gray-800/50'>
                            <TableCell className='font-medium'>{courseCode}</TableCell>
                            <TableCell>{course?.name}</TableCell>
                            <TableCell>
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                courseTypes[courseCode] === 'intensive'
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              )}>
                                {courseTypes[courseCode] === 'intensive' ? 'Intensive' : 'Standard'}
                              </span>
                            </TableCell>
                            <TableCell className='text-right font-medium'>
                              {calculatePrices(courseCode).toLocaleString('en-US', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                  <TableFooter className='bg-blue-50 dark:bg-blue-900/20'>
                    <TableRow>
                      <TableCell colSpan={3} className='font-semibold'>Total Amount</TableCell>
                      <TableCell className='text-right font-bold text-lg'>
                        ₦{totalAmount.toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              <div className='space-y-4'>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Important Notes:</h4>
                  <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Revision is compulsory for each course with an additional fee of <span className="font-semibold">₦10,000</span> per course</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Flexible payment options available - you can pay in installments</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2'>Payment Type</h3>
                  <div className="flex justify-between items-center gap-2 bg-gray-100 dark:bg-zinc-900 dark:text-gray-200 p-1 rounded-full max-w-md mx-auto">
                    <Button 
                      data-state={paymentType === 'partial' ? 'checked' : 'unchecked'}
                      onClick={() => setPaymentType('partial')}
                      className={cn(
                        "flex gap-1 items-center flex-1 py-2 px-4 rounded-full transition-all duration-200",
                        paymentType === 'partial' 
                          ? "bg-white dark:bg-zinc-600 text-gray-800 dark:text-gray-200 hover:bg-inherit shadow-bar dark:shadow-bar-dark font-medium" 
                          : "bg-transparent shadow-none text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                      )}
                    >
                      Partial Payment
                      {paymentType === 'partial' && <Check className='w-4 h-4' />}
                    </Button>
                    <Button
                      data-state={paymentType === 'full' ? 'checked' : 'unchecked'}
                      onClick={() => setPaymentType('full')}
                      className={cn(
                        "flex gap-1 items-center flex-1 py-2 px-4 rounded-full transition-all duration-200",
                        paymentType === 'full' 
                          ? "bg-white dark:bg-zinc-600 text-gray-800 dark:text-gray-200 hover:bg-inherit shadow-bar dark:shadow-bar-dark font-medium" 
                          : "bg-transparent shadow-none text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                      )}
                    >
                      Full Payment
                      {paymentType === 'full' && <Check className='w-4 h-4' />}
                    </Button>
                  </div>
                </div>
                <div className='flex justify-center'>
                  <p className='text-gray-500 dark:text-gray-400'>
                    Amount to pay: ₦{(paymentType === 'partial' ? totalAmount * 0.5 : totalAmount).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </div>
                <div className='flex justify-center'>
                  <Button 
                    className='bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium text-lg shadow-lg hover:shadow-xl'
                    onClick={() => {
                      initializePayment({onSuccess: handleSuccess, onClose: handleClose});
                    }}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}