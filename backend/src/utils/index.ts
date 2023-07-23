// https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
export function exclude(user: Object, keys: [key: string]) {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key))
    )
}