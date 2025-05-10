'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as Icon from "@phosphor-icons/react/dist/ssr";

const AboutHome = () => {
  const [tabActive, setTabActive] = useState<string>('about us')

  const handleTabActive = (item: string) => {
    setTabActive(item)
  }

  return (
    <div className="about-block lg:py-[100px] sm:py-16 py-10 bg-white">
      <div className="container">
        <div className="row flex max-lg:flex-col lg:items-center gap-y-6">
          <div className="w-full lg:w-1/2">
            <div className="bg-img w-full overflow-hidden rounded-3xl">
              <Image
                src="/images/component/assessment.png"
                width={4000}
                height={4000}
                alt="Digital marketing strategy assessment dashboard"
                className="w-full h-full block"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex-col lg:pl-20">
            <div className="heading3">Digital Strategy Assessment</div>
            <div className="nav-infor mt-8">
              <div className="list-nav flex items-center gap-10 border-b border-line w-fit">
                {
                  ['about us', 'mission', 'vision'].map((item, index) => (
                    <div className={`text-button-sm has-line-before line-2px line-blue cursor-pointer capitalize ${tabActive === item ? 'active' : ''}`}
                      key={index}
                      onClick={() => handleTabActive(item)}
                    >
                      {item}
                    </div>
                  ))
                }
              </div>
              <div className={`description item-filter ${tabActive === 'about us' ? 'show' : 'hide'}`}>
                <div className="title text-secondary mt-4">
                  We are a dedicated team crafting cutting-edge digital marketing solutions.
                  Explore our expertise, values, and achievements as we empower
                  brands for a thriving online future.
                </div>
                <div className="more-infor mt-6">
                  <div className="infor flex items-center gap-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Identification of target audience insights
                    </div>
                  </div>
                  <div className="infor flex items-center gap-3 mt-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Development of tailored digital marketing plans
                    </div>
                  </div>
                  <div className="infor flex items-center gap-3 mt-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Optimization and analysis of campaign performance
                    </div>
                  </div>
                </div>
              </div>
              <div className={`description item-filter ${tabActive === 'mission' ? 'show' : 'hide'}`}>
                <div className="title body3 text-secondary mt-4">
                  Our mission at Fascinante Digital is to provide comprehensive and personalized
                  digital marketing solutions that empower our clients to achieve their
                  business objectives and secure a dominant online presence.
                </div>
                <div className="more-infor mt-6">
                  <div className="infor flex items-center gap-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Crafting data-driven content strategies
                    </div>
                  </div>
                  <div className="infor flex items-center gap-3 mt-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Implementing effective SEO and SEM campaigns
                    </div>
                  </div>
                  <div className="infor flex items-center gap-3 mt-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Building engaging social media communities
                    </div>
                  </div>
                </div>
              </div>
              <div className={`description item-filter ${tabActive === 'vision' ? 'show' : 'hide'}`}>
                <div className="title body3 text-secondary mt-4">
                  Our unwavering vision is to be the most trusted and preferred
                  partner in achieving digital marketing excellence, diligently guiding our
                  valued clients toward a leading and prosperous online future.
                </div>
                <div className="more-infor mt-6">
                  <div className="infor flex items-center gap-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Driving measurable growth and ROI for clients
                    </div>
                  </div>
                  <div className="infor flex items-center gap-3 mt-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Pioneering innovative digital strategies
                    </div>
                  </div>
                  <div className="infor flex items-center gap-3 mt-3">
                    <Icon.CheckCircle weight="fill" className="text-blue text-xl" />
                    <div className="text-button">
                      Fostering long-term client relationships
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="button-block flex items-center gap-5 md:mt-10 mt-6 pb-2">
              <a
                className="button-main text-white bg-blue hover-button-black text-button rounded-full"
                href="contact-two.html"
              >
                Get started
              </a>
              <a
                className="button-main text-on-surface hover:bg-black hover:text-white hover:border-transparent bg-white text-button rounded-full border-2 border-blue flex items-center gap-2"
                href="tel:+18008864981" // <-- CAMBIO AQUÍ: se usa "tel:" seguido del número
              >
                <i className="ph ph-phone text-xl"></i>
                <span>+1 (800) 886 4981</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutHome;