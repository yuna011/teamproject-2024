// pages/api/location/getPlace.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

interface GeocodeResult {
    address_components: AddressComponent[];
    formatted_address: string;
}

interface GeocodeResponse {
    results: GeocodeResult[];
    status: string;
    error_message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, lng } = req.query;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.error("API key is missing.");
        return res.status(500).json({ error: "APIキーが設定されていません。" });
    }

    if (typeof lat !== 'string' || typeof lng !== 'string') {
        console.error("Latitude or Longitude is missing or incorrect.");
        return res.status(400).json({ error: "緯度または経度の値が不正です。" });
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await fetch(geocodeUrl);
        const data: GeocodeResponse = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;

            // 各要素を address_components から抽出
            const prefecture = addressComponents.find(component =>
                component.types.includes("administrative_area_level_1")
            )?.long_name;
            const city = addressComponents.find(component =>
                component.types.includes("locality")
            )?.long_name;
            const ward = addressComponents.find(component =>
                component.types.includes("sublocality_level_1")
            )?.long_name;
            const town = addressComponents.find(component =>
                component.types.includes("sublocality_level_2")
            )?.long_name;
            const chome = addressComponents.find(component =>
                component.types.includes("sublocality_level_3")
            )?.long_name;
            const blockNumber = addressComponents.find(component =>
                component.types.includes("sublocality_level_4")
            )?.long_name;
            const buildingNumber = addressComponents.find(component =>
                component.types.includes("premise")
            )?.long_name;

            // 日本の住所形式に整形
            const detailedAddress = `${prefecture || ''}${city || ''}${ward || ''}${town || ''}${chome || ''}${blockNumber || ''}-${buildingNumber || ''}`;

            return res.status(200).json({
                address: detailedAddress,
            });
        } else {
            console.error("Geocoding API returned an error:", data.error_message || data.status);
            return res.status(404).json({ error: "詳細情報が見つかりませんでした" });
        }
    } catch (error) {
        console.error("Error fetching place data:", error);
        return res.status(500).json({ error: "位置情報の取得に失敗しました" });
    }
}