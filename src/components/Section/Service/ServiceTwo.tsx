'use client'

import React from 'react'
import ServiceItem from '../../Service/ServiceItem'
import { ServiceType } from '@/type/ServiceType'

interface Props {
    data: Array<ServiceType>
}

const ServiceTwo: React.FC<Props> = ({ data }) => {
    return (
        <>
            <section className="service-block lg:mt-[100px] sm:mt-16 mt-10">
                <div className="container xl:flex items-center justify-center">
                    <div className="xl:w-1/3 w-full flex flex-col gap-4 flex-shrink-0">
                        <div className="text-sub-heading2 text-blue">Services</div>
                        {/* Heading adapted for Fascinante Digital */}
                        <h3 className="heading3">Your Partner for Fascinating Digital Growth</h3>
                        {/* Description adapted for Fascinante Digital */}
                        <div className="body3 text-secondary">We specialize in providing innovative digital marketing services and solutions to help businesses thrive online.</div>
                    </div>
                    {/*
                        Filter relaxed to show the first 4 services from the provided data array,
                        regardless of their original category.
                        If you want to filter by specific digital marketing categories,
                        please update the JSON data or the filter logic here.
                    */}
                    <div className="w-full xl:pl-[72px] list-service grid lg:grid-cols-2 sm:grid-cols-2 gap-8 max-xl:mt-8">
                        {/* Removed category filter */}
                        {data.slice(0, 4).map((item, index) => (
                            <ServiceItem data={item} style='style-two' number={index} key={index} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ServiceTwo
