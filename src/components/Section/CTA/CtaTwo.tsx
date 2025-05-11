'use client'

import React, { useState } from 'react';
import Link from "next/link";
import Modal from "@/components/Modal/Modal";

const CtaTwo = () => {
    // Estado para controlar la visibilidad del modal
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <>
            <div className="button-block">
                <button 
                    onClick={openModal} 
                    className="button-main bg-blue text-white"
                >
                    Start Your Audit
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title="Request an Audit">
                <form onSubmit={(e) => { 
                    e.preventDefault(); 
                    closeModal(); 
                    alert("Audit request submitted!");
                }}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Business Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your business name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                        <input
                            type="text"
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Owner Email</label>
                        <input
                            type="email"
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </Modal>
        </>
    )
}

export default CtaTwo;