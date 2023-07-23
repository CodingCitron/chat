import { create } from 'zustand'

interface State {
    email: string | null
    name: string | null
    isLogin: Boolean | null
} 

interface Actions {
    login: (user: State) => void
    logout: (user: State) => void
}

const DEFAULT_PROPS: State = {
    email: null,
    name: null,
    isLogin: false
}

export const useAuthStore = create<State & Actions>()((set) => ({
    ...DEFAULT_PROPS,
    login: (user: State) => set((state) => ({
        ...state,
        ...user,
        isLogin: true
    })),
    logout: (user: State) => set((state) => ({
        ...state,
        ...DEFAULT_PROPS
    }))
}))