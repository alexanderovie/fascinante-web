'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem"
import AboutTwo from "@/components/Section/About/AboutHome" // Assuming this component's content is relevant or will be adapted
import CounterTwo from "@/components/Section/Counter/Counter" // Assuming this component is relevant or will be adapted
import ServiceAboutOne from "@/components/Section/Service/ServiceAboutOne" // Assuming this component is relevant or will be adapted
import serviceData from '@/data/service.json' // Assuming this data is relevant or will be adapted
import OurTeam from "@/components/Section/OurTeam/OurTeam" // Assuming this component is relevant or will be adapted
import PartnerAbout from "@/components/Section/Partner/PartnerAbout" // Assuming this component is relevant or will be adapted
import CtaOne from "@/components/Section/CTA/CtaOne" // Assuming this is the adapted CtaOne component
import Footer from "@/components/Footer/Footer" // Assuming this is the adapted Footer component

export default function AboutStyleOne() {
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo /> {/* Assuming this component is generic or adapted */}
          <MenuOne /> {/* Assuming this is the adapted MenuTwo component */}
        </header>
        <main className="content">
          {/* Breadcrumb updated for Fascinante Digital's About Us page */}
          <BreadcrumbItem
            link="About Us" // Link remains the same
            img="/images/banner/about1.webp" // Assuming this image is suitable or a placeholder
            title="About Fascinante Digital" // Updated title
            desc="Learn more about our journey, values, and commitment to helping your business thrive in the digital world." // Updated description
          />
          {/* Content components - Ensure these are adapted to Fascinante Digital */}
          <AboutTwo />
          <CounterTwo classname="lg:pb-[100px] sm:pb-16 pb-10" />
          <ServiceAboutOne data={serviceData} />
          <OurTeam />
          <PartnerAbout />
          {/* Call to Action component */}
          <CtaOne />
        </main>
        <footer id="footer">
          {/* Footer component */}
          <Footer />
        </footer>
      </div >
    </>
  )
}
