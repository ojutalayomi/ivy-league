import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Paper } from '@/lib/data';
import { useCallback, useEffect, useState } from 'react';
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AxiosError } from 'axios';

export default function PapersRegistration() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const [selectedPapers, setSelectedPapers] = useState<{ [name: string]: { selected: boolean, type: { index: number, name: string } } }>({});
  const [email, setEmail] = useState(user.email);
  const [paymentType, setPaymentType] = useState<'partial' | 'full'>('full');
  const [searchParams, setSearchParams] = useSearchParams();
  const [papers, setPapers] = useState<Paper[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCurrentPapers] = useState<string[]>([]);
  const [coursesLimit, setCoursesLimit] = useState<number>(0);
  const [scholarships, setScholarships] = useState<{paper: string, percentage: number}[]>([]);
  const [currentFees, setCurrentFees] = useState<{
    amount: number;
    reason: string;
  }[]>([]);
  const [partialPayment, setPartialPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) {
      (async () => {
        try {
          setIsLoading(true);
            const response = await api.get(`/courses?api-key=AyomideEmmanuel&reg=true&acca_reg=${user.acca_reg || '001'}&user_status=${user.user_status}&email=${email}`);
            setCurrentPapers(response.data.current_papers);
            setCoursesLimit(response.data.course_limit);
            setScholarships(response.data.scholarships);
            setPartialPayment(response.data.partial_payment)
            const currentFees = response.data.fee;
            const filteredPapers = response.data.papers.filter((paper: Paper) => 
              user.user_status === 'student' ? !paper.code.some(code => response.data.current_papers.includes(code)) : true
            );
            setPapers(filteredPapers);
            setCurrentFees(currentFees);
        } catch (error) {
          console.error('Error fetching papers:', error);
          if (error instanceof Error) {
            const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
            setError(description);
          } else if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response: { data: { error: string } } }
            console.error('API Error:', axiosError.response.data.error)
            setError(axiosError.response.data.error);
          } else {
            console.error('Unexpected error:', error)
            setError('An unexpected error occurred');
          }
        } finally {
          setIsLoading(false);
        }
      })();
    };
  }, [user]);

  const totalAmount = useCallback((returnFull: boolean = false, deductCurrentFees: boolean = true) => {
    return Object.entries(selectedPapers).reduce((sum, [name, { selected, type }]) => {
      if (!selected) return sum;
      const paper = papers.find(p => p.name === name);
      if (!paper) return sum;
      if(paper.category === 'Additional') return sum + (paper.price[0] || 0);
      const types = Array.isArray(paper.type) ? paper.type : [];
      const prices = Array.isArray(paper.price) ? paper.price : [];
      const idx = types.findIndex((t: string) => t.toLowerCase() === (type?.name?.toLowerCase?.() ?? ''));
      const scholarship = scholarships.find(s => s.paper === paper?.code[type.index]);
      return sum + (prices[idx] || 0) - (scholarship && !returnFull ? (prices[idx] * scholarship.percentage / 100) : 0);
    }, 0) + (deductCurrentFees ? (currentFees?.reduce((acc, fee) => acc + fee.amount, 0) || 0) : 0);
  }, [selectedPapers, papers, scholarships, currentFees]);

  useEffect(() => {
    setEmail(user.email);
  }, [user.email]);

  useEffect(() => {
    if (searchParams.get('paymentSummary') === 'true' && totalAmount() === 0) {
      navigate(-1);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Please select at least one paper'
      })
    }
  }, [searchParams, navigate, totalAmount]);

  const getDiscountPapers = () => {
    return scholarships.length ? scholarships.map(s => s.paper).filter(paper => {
      return Object.entries(selectedPapers)
        .some(([name, { selected, type }]) => {
          if (!selected) return false;
          const foundPaper = papers.find(p => p.name === name);
          return foundPaper?.code[type.index] === paper;
        });
    }) : [];
  }
  const getDiscountPercentage = () => {
    return scholarships.length ? scholarships.filter(s => getDiscountPapers().includes(s.paper)).map(s => s.percentage) : [0];
  }

  const initializePayment = async () => {
    try {
      const STORAGE_KEY = 'additional_info_draft';
      const additionalInfo = localStorage.getItem(STORAGE_KEY);
      setIsLoading(true);
      const data = {
        diet: 2,
        amount: totalAmount(),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        reg_no: user.reg_no,
        sponsored: false,
        user_status: user.user_status,
        phone: user.phone_no,
        user_data: {
          discount: getDiscountPercentage(),
          discount_papers: getDiscountPapers(),
          papers: Object.entries(selectedPapers).map(([name]) => papers.find(p => p.name === name)?.code[0] || '').filter(Boolean),
          ...(user.user_status === 'signee' ? JSON.parse(additionalInfo || '{}') : {}),
          retaking: false,
        },
      }
      const response = await api.post(`/register?api-key=AyomideEmmanuel`, data);
      if (response.status === 200) {
        console.log(response.data);
        localStorage.setItem('reference', response.data.data.reference);
        toast({
          variant: 'success',
          title: 'Payment Initiated!',
          description: 'Please wait while we redirect you to the payment page.'
        })
        window.open(response.data.data.authorization_url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      if (error instanceof Error) {
        const message = (error as AxiosError<{error: {[x: string]: string} }>).response?.data?.error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, description] = Object.entries(message as {[x: string]: string})[0] || ['Error', 'An unexpected error occurred']
        setError(description);
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { error: string } } }
        console.error('API Error:', axiosError.response.data.error)
        setError(axiosError.response.data.error);
      } else {
        console.error('Unexpected error:', error)
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const groupedPapers = papers?.reduce((acc, paper) => {
    if (!acc[paper.category]) {
      acc[paper.category] = [];
    }
    acc[paper.category].push(paper);
    return acc;
  }, {} as { [key: string]: Paper[] });

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center gap-2 h-[50vh]">
          <div className='flex flex-col items-center gap-2'>
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
          <Button onClick={() => navigate(-1)} className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full max-w-md'>Go Back</Button>
        </div>
      ) :  (
        <div className="max-w-6xl mx-auto rounded-lg">
          {Object.entries(groupedPapers ?? {}).map(([category, categoryPapers]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 border-b-2 border-blue-200 dark:border-blue-700 pb-2">
              {category}{" "}{'(' + categoryPapers.length + ' papers)'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:items-start gap-4">
              {categoryPapers.map((paper) => {
                const isDisabled = (() => {
                  const isNotSelected = !selectedPapers[paper.name]?.selected;
                  const selectedCount = Object.entries(selectedPapers).filter(([, { selected }]) => selected).length;
                  return isNotSelected && selectedCount >= coursesLimit;
                })();
                return (
                <div key={paper.name} className={`p-4 relative border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {scholarships.length && scholarships.find(s => s.paper === paper.code[0]) && (
                    <div className='absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded-full'>
                      <p className='text-sm'>-{scholarships.find(s => s.paper === paper.code[0])?.percentage}%</p>
                    </div>
                  )}
                  <label className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      checked={!!selectedPapers[paper.name]?.selected}
                      disabled={isDisabled}
                      onChange={e => {
                      setSelectedPapers({
                        ...selectedPapers,
                          [paper.name]: {
                            selected: e.target.checked,
                            type: Array.isArray(paper.type) ? { 
                              index: 0,
                              name: paper.type[0] || ''
                            } : { 
                              index: 0, 
                              name: '' 
                            }
                          }
                        });
                        // console.log(selectedPapers);
                      }}
                      className={`h-5 w-5 text-blue-600 dark:text-blue-400 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    <span className="flex-1">
                        <span className="block font-medium text-gray-700 dark:text-gray-200">{paper.name}</span>
                        {Array.isArray(paper.type) && paper.type.length > 0 && Array.isArray(paper.price) && (
                      <span className="block text-sm text-gray-500 dark:text-gray-400">
                            {paper.type?.map((t: string, idx: number) => (
                              <span key={t + idx}>
                                {t}: ₦{paper.price?.[idx]?.toLocaleString()}
                                {idx < (paper.type?.length ?? 0) - 1 ? ' | ' : ''}
                              </span>
                            ))}
                      </span>
                        )}
                    </span>
                  </label>
                  {selectedPapers[paper.name]?.selected && Array.isArray(paper.type) && paper.type.length > 1 && Array.isArray(paper.price) && (
                  <div className="mt-2 ml-8">
                      <div className="flex flex-wrap items-center space-x-4">
                        {paper.type.map((t: string, idx: number) => (
                          <label key={t + idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                              name={`paper-type-${paper.name}`}
                              checked={selectedPapers[paper.name]?.type?.name === t}
                              onChange={() => setSelectedPapers({
                                ...selectedPapers,
                                [paper.name]: {
                                  ...selectedPapers[paper.name],
                                  type: { index: idx, name: t }
                                }
                          })}
                          className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400"
                        />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{t}</span>
                      </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedPapers[paper.name]?.selected && Array.isArray(paper.type) && Array.isArray(paper.price) && (
                    <div className="mt-2 ml-8 text-sm text-gray-700 dark:text-gray-200">
                      Price: ₦{(() => {
                        if(category === 'Additional') return paper.price[0]?.toLocaleString() || '0';
                        const types = paper.type;
                        const prices = paper.price;
                        const idx = types.findIndex((t: string) => t.toLowerCase() === (selectedPapers[paper.name]?.type?.name?.toLowerCase?.() ?? ''));
                        return prices[idx]?.toLocaleString() || '0';
                      })()}
                  </div>
                  )}
                </div>
              )
              })}
            </div>
          </div>
        ))}

          {papers?.length > 0 && (<div className="m-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Total Amount: ₦{totalAmount(false, false)?.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
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
                if (totalAmount() === 0) return toast({
                  variant: 'destructive',
                  title: "Oops!",
                  description: 'Please select at least one paper'
                });
                setSearchParams({paymentSummary: 'true'});
              }}
              disabled={totalAmount() === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full max-w-md"
            >
              {totalAmount() === 0 ? 'Select a paper to proceed' : 'Proceed to Payment'}
            </Button>
          </div>
          </div>)}

        <Dialog open={searchParams.get('paymentSummary') === 'true' && totalAmount() !== 0} onOpenChange={() => navigate(-1)}>
          <DialogContent className='dark:bg-gray-900 h-screen w-screen md:max-w-[calc(100vw-68px)] md:h-auto'>
            <DialogHeader className='space-y-4'>
              <DialogTitle className='text-2xl font-bold text-center text-gray-800 dark:text-gray-100'>Payment Summary</DialogTitle>
              <DialogDescription className='text-center text-gray-600 dark:text-gray-400'>
                Review your selected papers and payment details before proceeding
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 overflow-auto md:max-h-[70vh]">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <Table>
                  <TableCaption className='text-gray-500 dark:text-gray-400'>
                    Paper selection details and pricing.
                    {scholarships.length ? ` You have saved ${scholarships.reduce((acc, s) => acc + s.percentage, 0)}% on your registration fees, saving you ₦${(totalAmount(true) - totalAmount()).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} in total.` : ''}
                  </TableCaption>
                  <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                      <TableHead className='font-semibold'>Paper Code</TableHead>
                      <TableHead className='font-semibold'>Paper Name</TableHead>
                      <TableHead className='font-semibold'>Type</TableHead>
                      <TableHead className='font-semibold'>Discount</TableHead>
                      <TableHead className='font-semibold text-right'>Amount (₦)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(selectedPapers)
                      .filter(([, { selected }]) => selected)
                      .map(([name, { type }]) => {
                        const paper = papers.find(c => c.name === name);
                        const types = Array.isArray(paper?.type) ? paper.type : [];
                        const discount = scholarships.length ? scholarships.find(s => s.paper === paper?.code[type.index]) : false;
                        return (
                          <TableRow key={name} className='hover:bg-gray-100 dark:hover:bg-gray-800/50'>
                            <TableCell className='font-medium'>{paper?.code[type.index]}</TableCell>
                            <TableCell>{paper?.name}</TableCell>
                            <TableCell>
                              <span className={cn(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                  types.includes('Intensive')
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              )}>
                                {type.name}
                              </span>
                            </TableCell>
                            <TableCell>
                              {discount ? (
                                <span className="text-green-600 dark:text-green-400 font-semibold">
                                  {discount.percentage}%
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className='text-right font-medium'>
                              {(() => {
                                const prices = Array.isArray(paper?.price) ? paper.price : [];
                                const idx = types.findIndex((t: string) => t.toLowerCase() === (type?.name?.toLowerCase?.() ?? ''));
                                const scholarship = scholarships.find(s => s.paper === paper?.code[type.index]);
                                const price = prices[paper?.category === 'Additional' ? 0 : idx] - (scholarship ? (prices[idx] * scholarship.percentage / 100) : 0);
                                return price?.toLocaleString('en-US', {
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                }) || '0';
                              })()}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>

                  <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                      <TableHead colSpan={4} className='font-semibold'>Additional Fees</TableHead>
                      <TableHead className='font-semibold text-right'>Amount (₦)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentFees?.map((fee) => (
                      <TableRow key={fee.reason}>
                        <TableCell colSpan={4}>{fee.reason}</TableCell>
                        <TableCell className='text-right font-bold text-lg'>₦{fee.amount?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                  <TableFooter className='bg-blue-50 dark:bg-blue-900/20'>
                    <TableRow>
                      <TableCell colSpan={3} className='font-semibold'>Total</TableCell>
                      <TableCell colSpan={1} className='font-semibold'>{scholarships.length ? `${scholarships.reduce((acc, s) => acc + s.percentage, 0)}%` : ''}</TableCell>
                      <TableCell className='text-right font-bold text-lg'>
                          ₦{totalAmount()?.toLocaleString('en-US', { 
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
                      <span>Revision is compulsory for each paper with an additional fee of <span className="font-semibold">₦10,000</span> per paper</span>
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
                      data-partial={partialPayment}
                      disabled={!partialPayment}
                      className={cn(
                        `flex gap-1 items-center flex-1 py-2 px-4 rounded-full transition-all duration-200 ${!partialPayment ? 'opacity-50 cursor-not-allowed' : ''}`,
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
                      Amount to pay: ₦{(paymentType === 'partial' ? totalAmount()! * 0.5 : totalAmount())?.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </div>
                <div className='flex justify-center'>
                  <Button 
                    className='bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors font-medium text-lg shadow-lg hover:shadow-xl'
                    onClick={() => {
                        initializePayment();
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
      )}
    </div>
  );
}