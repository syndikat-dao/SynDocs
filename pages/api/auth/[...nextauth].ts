import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyOwnership } from "../../../utils/solana"

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Solana',
      credentials: {
        publicKey: { label: "Public Key", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.publicKey) {
          const { isOwner } = await verifyOwnership(credentials.publicKey)
          if (isOwner) {
            return { id: credentials.publicKey }
          }
        }
        return null
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
})
