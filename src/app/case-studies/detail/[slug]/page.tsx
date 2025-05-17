'use client'

import Link from 'next/link';
import Image from 'next/image';
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo"; // Assuming TopNavTwo is used here
import MenuOne from "@/components/Header/Menu/Menu"; // Assuming MenuTwo is used
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
// Import the adapted case study data
import caseStudyData from '@/data/case-study.json'; // Ensure this path is correct and uses the expanded JSON
import CtaOne from "@/components/Section/CTA/CtaOne"; // Assuming CtaOne is used
import Footer from "@/components/Footer/Footer"; // Assuming Footer is used
import * as Icon from "@phosphor-icons/react/dist/ssr";
import TestimonialTwo from '@/components/Section/Testimonial/TestimonialTwo'; // Assuming TestimonialTwo is used

// Define the type for the case study data, matching the expanded JSON structure
interface CaseStudyType {
    id: number;
    category: string;
    subTitle?: string;
    title: string;
    desc: string; // Used for main description and breadcrumb desc
    shortDesc?: string;
    img?: string; // Main image for the case study (used in Breadcrumb and How We Did It)
    projectInfo?: {
        client?: string;
        completedDate?: string;
        manager?: string;
        location?: string;
    };
    counts?: { label: string; value: string }[]; // Data for the count numbers
    howWeDidItHeading?: string; // Heading for the 'How We Did It' section
    howWeDidItText?: string; // Text for the 'How We Did It' section
    featuresList?: string[]; // List of features for 'How We Did It'
    finalOutcomeHeading?: string; // Heading for the final outcome
    finalOutcomeDesc?: string; // Description for the final outcome
    finalOutcomeImage?: string; // Image for the final outcome
}


// This component is for the dynamic route /detail/[slug]
export default function CaseStudyDetail({ params: { slug } }: { params: { slug: string } }) {

  // Find the case study data that matches the slug
  // Convert the title to lowercase and replace spaces with hyphens for comparison
  const foundCaseStudy: CaseStudyType | undefined = caseStudyData.find(item => {
    // Ensure item.title exists before calling toLowerCase and replace
    return item.title?.toLowerCase().replace(/ /g, '-') === slug;
  });

  // If no case study is found for the given slug, render a 404-like page
  if (!foundCaseStudy) {
    return (
        <div className="overflow-x-hidden">
            <header id="header">
                <TopNavTwo />
                <MenuOne />
            </header>
            <main className="content">
                 {/* Breadcrumb for 404 state */}
                 <BreadcrumbItem
                    link="Case Studies" // Link back to the case studies list page
                    img="/images/banner/about1.png" // Placeholder image for 404
                    title="Case Study Not Found"
                    desc={`No case study found for "${slug.replace(/-/g, ' ')}".`} // Display the slug in the description
                />
                <div className="container py-10 text-center">
                    <div className="heading3">Case Study Not Found</div>
                    <div className="body1 text-secondary mt-4">
                        We could not find the case study you were looking for.
                    </div>
                     {/* Link back to the main case studies page */}
                     <Link href="/case-studies" className="button-main mt-8">
                        Back to Case Studies
                    </Link>
                </div>
                {/* Include standard components */}
                <CtaOne />
                <Footer />
            </main>
        </div>
    );
  }

  // If a case study is found, render its details dynamically
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuOne />
        </header>
        <main className="content">
          {/* Breadcrumb dynamically updated with found case study data */}
          <BreadcrumbItem
            link="Case Studies" // Link back to the case studies list page
            img={foundCaseStudy.img || "/images/banner/about1.png"} // Use case study main image or a placeholder
            title={foundCaseStudy.title} // Use case study title
            desc={foundCaseStudy.desc} // Use case study description
          />
          <div className="project-infor lg:mt-[100px] sm:mt-16 mt-10">
            <div className="container">
              <div className="flex max-lg:flex-col justify-between items-start gap-y-8">
                <div className="w-full lg:w-7/12">
                  {/* Main heading dynamically updated */}
                  <div className="heading3">
                    {foundCaseStudy.title} {/* Using the title from the data */}
                  </div>
                  {/* Description dynamically updated */}
                  <div className="body3 text-secondary mt-4">
                    {foundCaseStudy.desc} {/* Using the description from the data */}
                  </div>
                  {/* Count numbers - Dynamically mapped if 'counts' exist in JSON */}
                  {foundCaseStudy.counts && foundCaseStudy.counts.length > 0 && (
                     <div className="count-number flex items-center justify-between mt-8 gap-5">
                        {foundCaseStudy.counts.map((count, idx) => (
                           <div className="item" key={idx}>
                              <div className="count-block flex items-center">
                                 <div className="counter heading4">{count.value}</div>
                                 {/* Add + if value doesn't include 'k' */}
                                 {!count.value.includes('k') && <span className="heading4">+</span>}
                              </div>
                              <div className="body3 text-secondary mt-4">{count.label}</div>
                           </div>
                        ))}
                     </div>
                  )}
                   {/* Note: Removed the static fallback for counts to encourage dynamic data use */}
                </div>
                <div className="w-full lg:w-1/3">
                  <div className="rounded-xl bg-white box-shadow p-8 flex flex-col justify-between">
                    <div className="heading6">Project Information</div>
                    {/* Project Information - Dynamically displayed if 'projectInfo' exists in JSON */}
                    {foundCaseStudy.projectInfo && (
                       <>
                          {/* Conditionally render each piece of project info */}
                          {foundCaseStudy.projectInfo.client && (
                             <div className="infor-item flex items-center justify-between mt-8">
                                <div className="text-button">Client</div>
                                <div className="body3 text-secondary">{foundCaseStudy.projectInfo.client}</div>
                             </div>
                          )}
                          {foundCaseStudy.projectInfo.completedDate && (
                             <>
                                <div className="line-x mt-4"></div>
                                <div className="infor-item flex items-center justify-between mt-4">
                                   <div className="text-button">Completed Date</div>
                                   <div className="body3 text-secondary">{foundCaseStudy.projectInfo.completedDate}</div>
                                </div>
                             </>
                          )}
                           {foundCaseStudy.projectInfo.manager && (
                             <>
                                <div className="line-x mt-4"></div>
                                <div className="infor-item flex items-center justify-between mt-4">
                                   <div className="text-button">Manager</div>
                                   <div className="body3 text-secondary">{foundCaseStudy.projectInfo.manager}</div>
                                </div>
                             </>
                          )}
                           {foundCaseStudy.projectInfo.location && (
                             <>
                                <div className="line-x mt-4"></div>
                                <div className="infor-item flex items-center justify-between mt-4">
                                   <div className="text-button">Location</div>
                                   <div className="body3 text-secondary">{foundCaseStudy.projectInfo.location}</div>
                                </div>
                             </>
                          )}
                       </>
                    )}
                     {/* Note: Removed the static fallback for project info */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* How We Did It section - Dynamically displayed if 'howWeDidItHeading' exists in JSON */}
          {foundCaseStudy.howWeDidItHeading && (
             <div className="how-we-did lg:mt-[100px] sm:mt-16 mt-10">
                <div className="container">
                   <div className="flex max-lg:flex-col gap-y-8">
                      <div className="w-full lg:w-1/2 lg:pr-10 bg-video">
                         <div className="bg-img h-full w-full">
                            {/* Image dynamically updated */}
                            <Image
                               width={4000} height={4000}
                               className="w-full block rounded-2xl"
                               src={foundCaseStudy.img || "/images/blog/930x593.png"} // Use case study main image or placeholder
                               alt={foundCaseStudy.title || "Case Study Image"} // Use case study title for alt text
                            />
                         </div>
                      </div>
                      <div className="w-full lg:w-1/2 flex items-center justify-center">
                         <div className="desc lg:pl-10 lg:pr-3">
                            {/* Heading dynamically updated */}
                            <div className="heading3">{foundCaseStudy.howWeDidItHeading}</div>
                            {/* Text dynamically updated */}
                            {foundCaseStudy.howWeDidItText && (
                               <div className="body3 text-secondary md:mt-10 mt-6">
                                  {foundCaseStudy.howWeDidItText}
                               </div>
                            )}
                            {/* Features list dynamically mapped if 'featuresList' exists in JSON */}
                            {foundCaseStudy.featuresList && foundCaseStudy.featuresList.length > 0 && (
                               <div className="list-feature gap-y-3 flex flex-col mt-6">
                                  {foundCaseStudy.featuresList.map((feature, fIdx) => (
                                     <div className="item flex items-center gap-3" key={fIdx}>
                                        <Icon.CheckCircle
                                           weight="fill"
                                           className="text-xl text-blue"
                                        />
                                        <div className="text-button">{feature}</div>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
           {/* Note: Removed the static fallback for 'How We Did It' section */}


           {/* Final Outcome section - Dynamically displayed if 'finalOutcomeHeading' exists in JSON */}
           {foundCaseStudy.finalOutcomeHeading && (
               <div className=" layout-item lg:mt-[100px] sm:mt-16 mt-10">
                  <div className="container">
                     <div className="flex max-lg:flex-col items-center gap-y-8">
                        <div className="w-full lg:w-1/2 lg:pr-[40px] flex flex-col justify-center">
                           {/* Heading dynamically updated */}
                           <div className="heading3">{foundCaseStudy.finalOutcomeHeading}</div>
                           {/* Description dynamically updated */}
                           {foundCaseStudy.finalOutcomeDesc && (
                              <div className="body2 text-secondary mt-5">
                                 {foundCaseStudy.finalOutcomeDesc}
                              </div>
                           )}
                           <div className="button-block mt-6">
                              {/* Link updated to a contact page */}
                              <Link
                                 className="button-main bg-black hover:bg-blue text-white text-button w-fit rounded-lg flex items-center gap-2"
                                 href="/contact" // Assuming /contact is your contact page
                              >
                                 <Icon.ArrowRight
                                    weight="bold"
                                    className="text-white rounded-xl"
                                 />
                                 <span>Get Started</span> {/* Button text updated */}
                              </Link>
                           </div>
                        </div>
                        <div className="w-full lg:w-1/2 lg:pl-[55px]">
                           <div className="bg-img w-full overflow-hidden rounded-2xl">
                              {/* Image dynamically updated */}
                              <Image
                                 width={4000} height={4000}
                                 className="w-full h-full hover-scale block"
                                 src={foundCaseStudy.finalOutcomeImage || "/images/component/assessment.png"} // Use case study final outcome image or placeholder
                                 alt={foundCaseStudy.finalOutcomeHeading || "Project Outcome Visual"} // Alt text
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
           )}
            {/* Note: Removed the static fallback for 'Final Outcome' section */}

          {/* Testimonial component */}
          <TestimonialTwo />
          {/* Call to Action component */}
          <CtaOne />
        </main>
        <footer id="footer">
          <Footer />
        </footer>
      </div >
    </>
  );
}
