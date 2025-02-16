'use client';

import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const page = () => {

    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [otp, sendOtp] = useState('');

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F7] py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
                <div className="flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-emerald-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span className="text-xl font-semibold text-gray-800">Service</span>
                </div>

                <PhoneInput
                    country={'in'}
                    value={phone}
                    onChange={() => setPhone(phone)}
                />
            </div>
        </div>
    )
}

export default page;
