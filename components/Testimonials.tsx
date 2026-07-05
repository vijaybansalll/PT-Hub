"use client";

import React from "react";
import { LuStar, LuMessageSquare } from "react-icons/lu";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
  itemBought: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Harpreet Kaur",
    role: "Housewife (Handiaya Bazar, Barnala)",
    avatar: "",
    rating: 5,
    content:
      "Mera sona te chandi de gahne bilkul naye varge ho gaye! Eh sonic cleaner bhut vadiya kam karda hai. Barnala vich aida di cheez pehli var dekhi hai, ghare baithe hi safai ho jandi.",
    itemBought: "Sonic-Wash Cleaner",
  },
  {
    id: "t2",
    name: "Manpreet Kaur",
    role: "Boutique Owner (Sadar Bazar, Barnala)",
    avatar: "",
    rating: 5,
    content:
      "Sade boutique lai eh traditional Punjabi suits da kapda bhut ghaint te unique aa ji. Customer bhut khush hunde ne fitting te fabric dekh ke. PT Hub imported stuff lai best hai.",
    itemBought: "Traditional Suit Fabric",
  },
  {
    id: "t3",
    name: "Rajwant Kaur",
    role: "Government Teacher (KC Road, Barnala)",
    avatar: "",
    rating: 5,
    content:
      "School te ghare copy checking te laptop use krde hoye mobile charge krna bhut aasan ho gya. Walnut wood da design bhut premium lagda. Bilkul value for money product hai.",
    itemBought: "Mag-Charge Desk Base",
  },
  {
    id: "t4",
    name: "Baljit Kaur",
    role: "Cloth Tailor (Dhula Road, Barnala)",
    avatar: "",
    rating: 5,
    content:
      "Main apne suit designs naal match krn lai eh jade pendant mangvaeya si. Esdi chamak te stone quality lajawab hai ji. Customer dekhde hi kehande ne - bhut sohna lagda!",
    itemBought: "Imperial Jade Pendant",
  },
  {
    id: "t5",
    name: "Amritpal Kaur",
    role: "Housewife (Club Road, Barnala)",
    avatar: "",
    rating: 5,
    content:
      "Kitchen vich chawal te dalan sambhalna bhut saukha ho gya. scaling cup naal bilkul sahi naap milda. Sade Barnala de gharan vich aidi automatic chiz di bhut lod si!",
    itemBought: "Culinary Rice Dispenser",
  },
  {
    id: "t6",
    name: "Jasvir Kaur",
    role: "Boutique Designer (Patiala Road, Barnala)",
    avatar: "",
    rating: 5,
    content:
      "Embroidery da kamm bhut hi bariki naal kita hoya hai ji. Fabric te stitching di quality no. 1 aa. Main apne boutique de special orders lai PT Hub to hi shopping krdi haan.",
    itemBought: "Designer Embroidered Suit",
  },
];

export default function Testimonials() {
  // Split testimonials into two groups to run in opposite directions
  const row1 = [...TESTIMONIALS];
  const row2 = [...TESTIMONIALS].reverse();

  // Duplicate arrays to create a seamless scrolling loop
  const doubleRow1 = [...row1, ...row1];
  const doubleRow2 = [...row2, ...row2];

  return (
    <section className="w-full py-8 md:py-16 bg-neutral-50/50 border-t border-neutral-200/30 overflow-hidden font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5 md:mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200/20">
          <LuMessageSquare className="h-3.5 w-3.5" /> Customer Stories
        </div>
        <h2 className="mt-3 font-semibold md:font-extrabold text-lg md:text-4xl text-neutral-900 tracking-tight">
          Loved by Tastemakers
        </h2>
        <p className="mt-1 md:mt-2 max-w-2xl text-sm text-neutral-500 leading-relaxed">
          See how our community of designers, architects, and creatives styling
          their spaces and wardrobes with PT Hub premium goods.
        </p>
      </div>

      {/* Marquee Rows Container */}
      <div className="flex flex-col gap-6 w-full relative">
        {/* Row 1: Left to Right */}
        <div className="flex overflow-hidden w-full select-none [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
          <div className="flex gap-4 w-max shrink-0 animate-marquee hover:[animation-play-state:paused] py-1">
            {doubleRow1.map((testimonial, idx) => (
              <TestimonialCard
                key={`${testimonial.id}-row1-${idx}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Right to Left (Reverse) */}
        {/* <div className="flex overflow-hidden w-full select-none [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
          <div className="flex gap-4 w-max shrink-0 animate-marquee-reverse hover:[animation-play-state:paused] py-1">
            {doubleRow2.map((testimonial, idx) => (
              <TestimonialCard key={`${testimonial.id}-row2-${idx}`} testimonial={testimonial} />
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-[300px] sm:w-[380px] shrink-0 p-3 md:p-6 rounded-2xl border border-neutral-200/50 bg-white shadow-sm flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all duration-300 backdrop-blur-sm">
      <div>
        {/* Stars and Bought Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <LuStar key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] font-medium md:font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10">
            {testimonial.itemBought}
          </span>
        </div>

        {/* Content */}
        <p className="text-xs md:text-sm text-neutral-600 leading-relaxed italic mb-1 md:mb-6">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>

      {/* Author Profile */}
      <div className="flex items-center gap-3 border-t border-neutral-100 pt-2 md:pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white text-xs font-extrabold shadow-sm select-none">
          {initials}
        </div>
        <div>
          <h4 className="text-xs md:text-sm font-medium md:font-bold text-neutral-900 leading-none">
            {testimonial.name}
          </h4>
          <span className="text-[9px] md:text-[11px] font-medium text-neutral-400 mt-1 block">
            {testimonial.role}
          </span>
        </div>
      </div>
    </div>
  );
}
