// Next.jsのAPIリクエストおよびレスポンスの型をインポート
import { NextApiRequest, NextApiResponse } from 'next';

// 各住所コンポーネントのインターフェース
interface AddressComponent {
    long_name: string; // 完全な名称（例: 'Tokyo'）
    short_name: string; // 短縮名称（例: 'Tokyo'）
    types: string[]; // このコンポーネントのタイプ（例: ['locality', 'political']）
}

// ジオコードAPIの単一結果のインターフェース
interface GeocodeResult {
    address_components: AddressComponent[]; // 各アドレスの部分コンポーネントのリスト
    formatted_address: string; // 住所全体のフォーマット済み文字列
}

// ジオコードAPIレスポンス全体のインターフェース
interface GeocodeResponse {
    results: GeocodeResult[]; // ジオコード結果のリスト
    status: string; // APIリクエストのステータス（例: 'OK'）
    error_message?: string; // エラーメッセージ（リクエスト失敗時のみ）
}

// APIエンドポイントのメインハンドラ関数
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // リクエストから緯度と経度を取得
    const { lat, lng } = req.query;
    // 環境変数からGoogle Maps APIキーを取得
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // APIキーが存在しない場合、エラーメッセージを返す
    if (!apiKey) {
        console.error('API key is missing.');
        return res.status(500).json({ error: 'APIキーが設定されていません。' });
    }

    // 緯度・経度が適切な文字列でない場合、エラーメッセージを返す
    if (typeof lat !== 'string' || typeof lng !== 'string') {
        console.error('Latitude or Longitude is missing or incorrect.');
        return res.status(400).json({ error: '緯度または経度の値が不正です。' });
    }

    // Geocoding APIのURLに日本語の住所形式を指定するためのパラメータ 'language=ja' を追加
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ja`;

    try {
        // Geocoding APIにリクエストを送信
        const response = await fetch(geocodeUrl);
        // レスポンスをJSON形式で取得
        const data: GeocodeResponse = await response.json();

        // レスポンスが正常であり、結果が存在する場合のみ処理を続ける
        if (data.status === 'OK' && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;

            // address_componentsから住所の各要素を抽出
            const prefecture = addressComponents.find(component =>
                component.types.includes('administrative_area_level_1')
            )?.long_name;
            const city = addressComponents.find(component =>
                component.types.includes('locality')
            )?.long_name;
            const ward = addressComponents.find(component =>
                component.types.includes('sublocality_level_1')
            )?.long_name;
            const town = addressComponents.find(component =>
                component.types.includes('sublocality_level_2')
            )?.long_name;
            const chome = addressComponents.find(component =>
                component.types.includes('sublocality_level_3')
            )?.long_name;
            const blockNumber = addressComponents.find(component =>
                component.types.includes('sublocality_level_4')
            )?.long_name;
            const buildingNumber = addressComponents.find(component =>
                component.types.includes('premise')
            )?.long_name;

            // 日本の住所形式に整形
            const detailedAddress = `${prefecture || ''}${city || ''}${ward || ''}${town || ''}${chome || ''}${blockNumber || ''}-${buildingNumber || ''}`;

            // 整形された住所をレスポンスとして返す
            return res.status(200).json({
                address: detailedAddress,
            });
        } else {
            // Geocoding APIがエラーを返した場合、エラーメッセージをログに出力
            console.error('Geocoding API returned an error:', data.error_message || data.status);
            return res.status(404).json({ error: '詳細情報が見つかりませんでした' });
        }
    } catch (error) {
        // リクエストエラーが発生した場合、エラーメッセージをログに出力
        console.error('Error fetching place data:', error);
        return res.status(500).json({ error: '位置情報の取得に失敗しました' });
    }
}