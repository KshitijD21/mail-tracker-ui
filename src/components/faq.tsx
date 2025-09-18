"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <section id="faq" className="py-20 px-4 md:px-8 w-full">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Does MailTrackerX work with Gmail?
            </AccordionTrigger>
            <AccordionContent>
              Yes — just paste our pixel code in your Gmail or any email
              provider.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Is recipient data safe?</AccordionTrigger>
            <AccordionContent>
              100%. We use encrypted storage and never share your data.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Do I need to install anything?</AccordionTrigger>
            <AccordionContent>
              No. It&apos;s browser-based and fully self-serve.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
