import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { students } from '@/lib/data';
import { useEffect, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';

interface Course {
  category: string;
  name: string;
  code: string;
  standardPrice: number;
  revisionPrice?: number;
}

const courses: Course[] = [
  { category: 'Knowledge Papers', name: 'Business and Technology', code: 'BT', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Knowledge Papers', name: 'Management Accounting', code: 'MA', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Knowledge Papers', name: 'Financial Accounting', code: 'FA', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Corporate and Business Law', code: 'CBL', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Performance Management', code: 'PM', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Taxation', code: 'TAX', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Financial Reporting', code: 'FR', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Audit and Assurance', code: 'AA', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Skill Papers', name: 'Financial Management', code: 'FM', standardPrice: 30000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Strategic Business Leaders', code: 'SBL', standardPrice: 45000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Strategic Business Reporting', code: 'SBR', standardPrice: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Financial Management', code: 'AFM', standardPrice: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Performance Management', code: 'APM', standardPrice: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Taxation', code: 'ATX', standardPrice: 35000, revisionPrice: 10000 },
  { category: 'Professional Papers', name: 'Advanced Audit and Assurance', code: 'AAA', standardPrice: 35000, revisionPrice: 10000 },
  { category: 'Additional', name: 'Oxford Brookes Mentoring', code: 'OBU', standardPrice: 90000 },
  { category: 'Additional', name: 'Diploma in IFRS', code: 'DipIFRS', standardPrice: 75000 },
];

export default function CourseRegistration() {
  const [selectedCourses, setSelectedCourses] = useState<{ [key: string]: boolean }>({});
  const [includeRevision, setIncludeRevision] = useState<{ [key: string]: boolean }>({});
  // const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [email, setEmail] = useState('');

  const totalAmount = courses.reduce((total, course) => {
    if (selectedCourses[course.code]) {
      let price = course.standardPrice;
      if (includeRevision[course.code] && course.revisionPrice) {
        price += course.revisionPrice;
      }
      return total + price;
    }
    return total;
  }, 0);

  useEffect(() => {
    setEmail(students[0].email);
    // console.log(courses.map(course => course.name + '(' + course.code + ')').join(', '))
  }, []);

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email,
    amount: totalAmount * 100, // Convert to kobo
    publicKey: 'pk_test_5646402cf3e889cd89d53eeb1d00400000000000',
  };

  const initializePayment = usePaystackPayment(config);

  const handleSuccess = () => {
    toast({
      variant: 'success',
      title: "Success!", 
      description: 'Payment successful! Thank you for your registration.'
    })
    setSelectedCourses({});
    setIncludeRevision({});
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
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Course Registration</h1>
      
      <div className="max-w-6xl mx-auto rounded-lg">
        {Object.entries(groupedCourses).map(([category, categoryCourses]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryCourses.map((course) => (
                <div key={course.code} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600">
                  <label className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      checked={!!selectedCourses[course.code]}
                      onChange={(e) => setSelectedCourses({
                        ...selectedCourses,
                        [course.code]: e.target.checked
                      })}
                      className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                    <span className="flex-1">
                      <span className="block font-medium text-gray-700 dark:text-gray-200">{course.name} ({course.code})</span>
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                        Standard: ₦{course.standardPrice.toLocaleString()}
                        {course.revisionPrice && ` | Revision: ₦${course.revisionPrice.toLocaleString()}`}
                      </span>
                    </span>
                  </label>
                  
                  {course.revisionPrice && selectedCourses[course.code] && (
                    <div className="mt-2 ml-8">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!!includeRevision[course.code]}
                          onChange={(e) => setIncludeRevision({
                            ...includeRevision,
                            [course.code]: e.target.checked
                          })}
                          className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Include Revision Material (+₦{course.revisionPrice.toLocaleString()})</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="m-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex flex-col space-y-4">
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Total Amount: ₦{totalAmount.toLocaleString()}
            </div>
            
            <Input
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
                initializePayment({onSuccess: handleSuccess, onClose: handleClose});
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors w-full max-w-md"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}