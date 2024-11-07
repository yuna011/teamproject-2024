// pages/api/pincode.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
    randomCode: string;
    error?: string;
};

function generateFourDigitCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        try {
            const randomCode = generateFourDigitCode();
            return res.status(200).json({ randomCode });
        } catch (error) {
            console.error("Error generating PIN code:", error);
            return res.status(500).json({ randomCode: '', error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}