export default function Regulations() {
    return (
        <div>
            <h1 className="text-center">利用するには</h1>
            <div className="flex flex-col gap-4">
                <div>
                    <div className="text-xl">
                        <input type="checkbox" />
                        <label htmlFor="">ユーザーライセンス契約</label>
                    </div>
                    <p className="text-gray-400">これには、アプリの安全性、セキュリティ機能を保証するために、「アプリ名」が「アプリ名」本体含む各機能のソフトウェアを自動的に随時更新することに同意することも含まれます。</p>
                    <a href="#">詳細</a>
                </div>
                <div>
                    <div className="text-xl">
                        <input type="checkbox" />
                        <label htmlFor="">利用規約</label>
                    </div>
                    <p className="text-gray-400">これには、アプリの安全性、セキュリティ機能を保証するために、「アプリ名」が「アプリ名」本体含む各機能のソフトウェアを自動的に随時更新することに同意することも含まれます。</p>
                    <a href="#">詳細</a>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
} 