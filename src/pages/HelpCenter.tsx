import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "Go to the reset password page and enter your email. Follow the instructions sent to your inbox.",
    link: "/accounts/reset-password",
    linkText: "Reset Password"
  },
  {
    question: "How do I register for papers?",
    answer: "Navigate to the student dashboard, select 'Papers', and follow the registration steps.",
    link: "/papers/register",
    linkText: "Register for Papers"
  },
  {
    question: "How do I contact support?",
    answer: "You can email us at support@ivyleague.com or use the chat widget at the bottom right of the page.",
    link: "/accounts/contact-support",
    linkText: "Contact Support"
  },
  {
    question: "How do I update my profile information?",
    answer: "Go to your dashboard, click on 'Profile', and edit your details.",
    link: "/profile",
    linkText: "Update Profile"
  },
  {
    question: "Where can I find payment information?",
    answer: "Payment details and history are available in the 'Payments' section of your dashboard.",
    link: "/payments",
    linkText: "Payment Information"
  }
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 bg-gradient-to-br from-cyan-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-none bg-white/90 dark:bg-gray-900/90">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-cyan-500">Help Center</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
            How can we help you? Find answers to common questions or contact our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <Input
              placeholder="Search for help..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" className="px-3" aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          <Accordion type="single" collapsible className="mb-8">
            {(filteredFaqs.length > 0 ? filteredFaqs : faqs).map((faq) => (
              <AccordionItem value={faq.question} key={faq.question}>
                <AccordionTrigger className="text-base font-medium text-cyan-600 dark:text-cyan-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-200">
                  {faq.answer}{"\n"}
                  {faq.link && (
                    <Link to={faq.link} className="text-cyan-600 font-bold dark:text-cyan-400">
                      {faq.linkText}
                    </Link>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <div className="mb-4 text-gray-700 dark:text-gray-200 font-medium">Still need help?</div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="gap-2">
                <Link to="mailto:support@ivyleague.com" target="_blank" rel="noopener noreferrer">
                  <Mail className="w-5 h-5" />
                  Email Support
                </Link>
              </Button>
              {/* <Button asChild variant="outline" className="gap-2">
                <Link to="#chat-widget">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat
                </Link>
              </Button> */}
            </div>
            <div className="mt-4 text-xs text-gray-400">Response time: within 24 hours (email), instant (chat)</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
