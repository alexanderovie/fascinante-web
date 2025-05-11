'use client'

import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
import CtaOne from "@/components/Section/CTA/CtaOne";
import Footer from "@/components/Footer/Footer";
import * as Icon from "@phosphor-icons/react/dist/ssr";

export default function ContactStyleOne() {
  return (
    <>
      <div className="overflow-x-hidden">
        <header id="header">
          <TopNavTwo />
          <MenuOne />
        </header>
        <main className="content">
          {/* Breadcrumb updated for Fascinante Digital */}
          <BreadcrumbItem
            link="Contact" // Link updated to match common practice
            img="/images/banner/about1.webp" // Assuming this image is suitable or a placeholder
            title="Get In Touch" // Updated title
            desc="Connect with Fascinante Digital for expert Web Design, Digital Marketing, and Local Listing services." // Updated description
          />
          <div className="form-contact style-one lg:py-[100px] sm:py-16 py-10">
            <div className="container flex items-center justify-center">
              <div className="xm:w-5/6 w-full flex max-xl:flex-col xl:items-center gap-y-8">
                <div className="w-full xl:w-2/5">
                  <div className="infor bg-blue rounded-xl p-10">
                    {/* Heading updated */}
                    <div className="heading5 text-white">Let&apos;s Connect</div>
                    {/* Description updated */}
                    <div className="body3 text-white mt-2">
                      Reach out to us! We&apos;re here to help you elevate your digital presence.
                    </div>
                    {/* Social media links - Assuming these are correct and styled */}
                    <div className="list-social flex flex-wrap items-center gap-3 md:mt-10 mt-6">
                      <a
                        className="item rounded-full w-12 h-12 flex items-center justify-center bg-surface"
                        href="https://www.facebook.com/"
                        target="_blank"
                        aria-label="Facebook" // Added aria-label for accessibility
                      >
                        <i className="icon-facebook text-black"></i>
                      </a>
                      <a
                        className="item rounded-full w-12 h-12 flex items-center justify-center bg-surface"
                        href="https://www.linkedin.com/"
                        target="_blank"
                        aria-label="LinkedIn" // Added aria-label for accessibility
                      >
                        <i className="icon-in text-black"></i>
                      </a>
                      <a
                        className="item rounded-full w-12 h-12 flex items-center justify-center bg-surface"
                        href="https://www.twitter.com/"
                        target="_blank"
                        aria-label="Twitter" // Added aria-label for accessibility
                      >
                        <i className="icon-twitter text-sm text-black ml-1"></i>
                      </a>
                      <a
                        className="item rounded-full w-12 h-12 flex items-center justify-center bg-surface"
                        href="https://www.instagram.com/"
                        target="_blank"
                        aria-label="Instagram" // Added aria-label for accessibility
                      >
                        <i className="icon-insta text-sm text-black"></i>
                      </a>
                      <a
                        className="item rounded-full w-12 h-12 flex items-center justify-center bg-surface"
                        href="https://www.youtube.com/"
                        target="_blank"
                        aria-label="YouTube" // Added aria-label for accessibility
                      >
                        <i className="icon-youtube text-xs text-black"></i>
                      </a>
                    </div>
                    {/* Contact details updated for Fascinante Digital */}
                    <div className="list-more-infor md:mt-10 mt-6">
                      <div className="item flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0">
                          <Icon.Clock
                            weight="bold"
                            className="text-blue text-2xl"
                          />
                        </div>
                        <div className="line-y"></div>
                        {/* Business hours - Keep or update as needed */}
                        <div className="text-button normal-case text-white">
                          8AM - 6PM, Mon - sun
                        </div>
                      </div>
                      <div className="item flex items-center gap-3 mt-5">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0">
                          <Icon.Phone
                            weight="fill"
                            className="text-blue text-2xl"
                          />
                        </div>
                        <div className="line-y"> </div>
                        {/* Phone number updated */}
                        <div className="text-button normal-case text-white">
                          (800) 886-4981
                        </div>
                      </div>
                      <div className="item flex items-center gap-3 mt-5">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0">
                          <Icon.EnvelopeSimple
                            weight="bold"
                            className="text-blue text-2xl"
                          />
                        </div>
                        <div className="line-y"> </div>
                        {/* Email updated - Replace with actual email if available */}
                        <div className="text-button normal-case text-white">
                          info@fascinantedigital.com {/* Placeholder email */}
                        </div>
                      </div>
                      <div className="item flex items-center gap-3 mt-5">
                        <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0">
                          <Icon.MapPin
                            weight="bold"
                            className="text-blue text-2xl"
                          />
                        </div>
                        <div className="line-y"> </div>
                        {/* Address updated */}
                        <div className="text-button normal-case text-white">
                          2054 Vista Pkwy # 400, West Palm Beach, FL 33411
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full xl:w-3/5 xl:pl-20">
                  <form className="form-block flex flex-col justify-between gap-5">
                    <div className="heading">
                      {/* Heading updated */}
                      <div className="heading5">Send Us a Message</div>
                      {/* Description updated */}
                      <div className="body3 text-secondary mt-2">
                        Fill out the form below and we&apos;ll get back to you shortly.
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="w-full">
                        <input
                          className="w-full bg-surface text-secondary caption11 px-4 py-3 rounded-lg"
                          type="text"
                          placeholder="Your Name" // Placeholder updated
                          required
                        />
                      </div>
                      <div className="w-full">
                        <input
                          className="w-full bg-surface text-secondary caption11 px-4 py-3 rounded-lg"
                          type="text"
                          placeholder="Subject"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          className="w-full bg-surface text-secondary caption11 px-4 py-3 rounded-lg"
                          type="email" // Changed type to email
                          placeholder="Your Email" // Placeholder updated
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        {/* Select options updated for Fascinante Digital's services */}
                        <select
                          className="w-full bg-surface text-secondary caption11 pl-3 py-3 rounded-lg"
                          name="serviceOfInterest" // Updated name
                          defaultValue="" // Added default value
                          required // Added required attribute
                        >
                           <option value="" disabled>Select a Service</option> {/* Default disabled option */}
                           <option value="Web Design">Web Design</option>
                           <option value="Digital Marketing">Digital Marketing</option>
                           <option value="Local Directory Listing">Local Directory Listing</option>
                           <option value="Other">Other</option> {/* Added 'Other' option */}
                        </select>
                        <i className="ph ph-caret-down"></i> {/* Assuming this icon is handled by CSS */}
                      </div>
                      <div className="col-span-2 w-full">
                        <textarea
                          className="w-full bg-surface text-secondary caption11 px-4 py-3 rounded-lg"
                          name="message"
                          rows={4}
                          placeholder="Your Message"
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="button-block">
                      {/* Button text updated */}
                      <button type="submit" className="button-main hover:border-blue bg-blue text-white text-button rounded-full">
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* CtaOne component - Assuming this is the adapted CtaOne */}
          <CtaOne />
        </main>
        <footer id="footer">
          {/* Footer component - Assuming this is the adapted Footer */}
          <Footer />
        </footer>
      </div>
    </>
  );
}
