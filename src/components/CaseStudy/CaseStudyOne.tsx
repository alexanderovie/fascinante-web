'use client'

import React, { useState } from 'react'
import CaseStudyItem from './CaseStudyItem'
import { CaseStudyType } from '@/type/CaseStudyType' // Assuming CaseStudyType is correctly defined
import { motion } from 'framer-motion' // Assuming framer-motion is installed and configured

interface Props {
    data: Array<CaseStudyType> // Data should contain case studies with a 'category' property matching the tab labels
}

const CaseStudyOne: React.FC<Props> = ({ data }) => {
    // Set initial active tab to 'all' or a default category if preferred
    const [activeTab, setActiveTab] = useState<string>('all') // Changed initial state from 'fintech'

    // Handler for clicking on a tab
    const handleTabClick = (item: string) => {
        setActiveTab(item)
    }

    // Define the tabs based on Fascinante Digital's services
    const tabs = ['all', 'web-design', 'digital-marketing', 'local-listing'];
    // You can add more specific categories if needed, e.g., 'seo', 'e-commerce', etc.
    // Make sure the 'category' property in your caseStudyData matches these strings.


    return (
        <>
            <div className="service-block lg:py-[100px] sm:py-16 py-10">
                <div className="container flex flex-col items-center">
                    {/* Filter tabs updated for Fascinante Digital's services */}
                    <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl">
                        {tabs.map((item, index) => (
                            <div
                                key={index}
                                className={`tab-item relative text-secondary text-button-sm py-2 px-5 cursor-pointer duration-500 hover:text-black ${activeTab === item ? 'active' : ''}`}
                                onClick={() => handleTabClick(item)}
                            >
                                {activeTab === item && (
                                    // Framer Motion div for the active tab indicator
                                    <motion.div layoutId='active-pill' className='absolute inset-0 rounded-2xl bg-white'></motion.div>
                                )}
                                {/* Tab text - capitalize the first letter for display */}
                                <span className='relative text-button-sm white-space-nowrap capitalize z-[1] active:text-black'>
                                    {item.replace('-', ' ')} {/* Replace hyphens for better display */}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* List of case study items, filtered based on the active tab */}
                    <div className="list-service grid xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-8 gap-y-10 md:mt-10 mt-6">
                        {/* Filter data: show all if activeTab is 'all', otherwise filter by category */}
                        {data.filter(item => activeTab === 'all' ? true : item.category === activeTab).map((item, index) => (
                            // Render CaseStudyItem for each filtered item
                            <CaseStudyItem data={item} style='style-one' key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CaseStudyOne
