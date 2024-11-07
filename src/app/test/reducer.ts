
export type Action =
    { type: 'PLUS' } |
    { type: 'MINUS' } |
    { type: 'RESET' }
// stateの変更パターンをAction typeにあらかじめ宣言。Actionを通さない変更はError、Action型に存在しない変更もError。

// 「state: 任意の型」 → 操作されるstateの型を明示。今回はnumberだけなので直接書いているが、通常はpage.tsx/reducer.tsのどちらかで「export type」宣言し、どちらかでimportして使用する。
export function countReducer(state: number, action: Action): number {
    switch (action.type) {
        case 'PLUS':
            return state + 1
        case 'MINUS':
            return state - 1
        case 'RESET':
            return 0
        default: return state
    }
}