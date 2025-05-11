"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import TopNavTwo from "@/components/Header/TopNav/TopNavTwo";
import MenuOne from "@/components/Header/Menu/MenuTwo";
import BreadcrumbItem from "@/components/Breadcrumb/BreadcrumbItem";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function AuditPage() {
    const [step, setStep] = useState(1);
    const [businessName, setBusinessName] = useState("");
    const [category, setCategory] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");

    const handleNext = () => {
        if (step < 2) setStep(step + 1);
    };

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log({ businessName, category, ownerName, ownerEmail });
        alert("Audit request submitted!");
    };

    return (
        <div className={inter.className}>
            <header id="header">
                <TopNavTwo />
                <MenuOne />
            </header>
            <main className="content">
                <BreadcrumbItem
                    link="Audit"
                    img="/images/banner/about1.webp"
                    title="Request a Free Audit"
                    desc="Get a detailed local audit for your business to improve online visibility."
                />

                <div className="form-audit bg-white py-20">
                    <div className="container">
                        {step === 1 && (
                            <div>
                                <h2 className="heading5 mb-6">Step 1: Business Name</h2>
                                <input
                                    type="text"
                                    className="w-full bg-surface text-secondary caption1 px-4 py-3 rounded-lg mb-6"
                                    placeholder="Enter your business name"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    required
                                />
                                <button className="button-main bg-blue text-white rounded-full py-3 px-6" onClick={handleNext}>
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit}>
                                <h2 className="heading5 mb-6">Step 2: Business Details</h2>
                                <input
                                    type="text"
                                    className="w-full bg-surface text-secondary caption1 px-4 py-3 rounded-lg mb-6"
                                    placeholder="Business Category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    className="w-full bg-surface text-secondary caption1 px-4 py-3 rounded-lg mb-6"
                                    placeholder="Owner Name"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    className="w-full bg-surface text-secondary caption1 px-4 py-3 rounded-lg mb-6"
                                    placeholder="Owner Email"
                                    value={ownerEmail}
                                    onChange={(e) => setOwnerEmail(e.target.value)}
                                    required
                                />
                                <div className="flex gap-4">
                                    <button type="button" className="button-main bg-gray-400 text-white rounded-full py-3 px-6" onClick={handlePrevious}>
                                        Previous
                                    </button>
                                    <button type="submit" className="button-main bg-blue text-white rounded-full py-3 px-6">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
            <footer id="footer">
                <Footer />
            </footer>
        </div>
    );
}