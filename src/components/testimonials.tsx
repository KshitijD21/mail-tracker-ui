"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Rohit J.",
    designation: "Founder, StartupX",
    testimonial:
      "Before using this tool, I was blindly sending cold emails without knowing if anyone even read them. The real-time open tracking changed everything. Now I follow up exactly when interest is hot, not when it’s too late. In fact, I closed two deals last week just by timing my follow-ups based on opens. For a solo founder, it’s like having a virtual sales assistant doing half the job.",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    id: 2,
    name: "Divya M.",
    designation: "Software Developer, Freelance",
    testimonial:
      "When you're applying for 30+ roles, writing unique replies becomes exhausting. The AI-generated suggestions saved me hours every day. I could simply select, tweak a bit, and send — all while sounding professional and personal. I ended up landing 5 interviews in two weeks. Honestly, it made job hunting way less stressful and way more efficient.",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: 3,
    name: "Ankit R.",
    designation: "Recruiter, TalentForge",
    testimonial:
      "In recruiting, timing is everything. I used to lose candidates because I didn’t know when they’d read my messages. Now, with instant email open alerts and link tracking, I can follow up at just the right moment. The WhatsApp reply notifications are gold — I never miss a chance to respond quickly, which has drastically improved my engagement rates.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 4,
    name: "Sanya P.",
    designation: "Marketing Manager, GrowthLoop",
    testimonial:
      "We rely heavily on cold outreach to drive our marketing campaigns. This tool gave us complete visibility into how recipients interact with our emails. From open timing to link click data, we now know what works. The insights helped us redesign our CTAs and improve conversions by over 25%. It’s become an essential part of our outreach stack.",
    avatar: "https://randomuser.me/api/portraits/women/16.jpg",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[index];

  return (
    <section className="bg-white py-10 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-2">Testimonials</h2>
        <p className="text-gray-600 text-lg mb-10">What our users are saying</p>

        <div className="relative bg-white rounded-xl px-8 py-12 max-w-2xl mx-auto transition-all duration-500 ease-in-out">
          <Quote className="absolute top-4 left-1/2 -translate-x-1/2 text-gray-300 w-12 h-12" />

          <p className="text-lg text-gray-800 leading-relaxed text-center mt-8">
            “{t.testimonial}”
          </p>

          <div className="mt-10 flex flex-col items-center">
            <Avatar className="w-14 h-14 mb-2">
              <AvatarImage src={t.avatar} alt={t.name} />
              <AvatarFallback className="text-xl font-semibold bg-[#1E1E2F] text-white">
                {t.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-xl font-semibold text-gray-900">{t.name}</p>
            <p className="text-sm text-gray-500">{t.designation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
