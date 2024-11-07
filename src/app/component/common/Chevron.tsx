'use client'
import { FaChevronRight } from 'react-icons/fa';

export default function Chevron({ prevLink = '#', nextLink = '#' }) {
    return (
        <div className='fixed bottom-10 w-full'>
            <div className='flex justify-between items-end mx-12'>
                <a href={prevLink} className='w-fit p-4 rounded-full rotate-180 bg-gray-400'>
                    <FaChevronRight color='white' />
                </a>
                <a href={nextLink} className='w-fit p-4  rounded-full  bg-[#3570c6]'>
                    <FaChevronRight color='white' />
                </a>
            </div>
        </div>
    )
}