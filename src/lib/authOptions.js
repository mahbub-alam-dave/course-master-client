import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";


export const authOptions = {

providers: [
  CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "Username", type: "text", placeholder: "jsmith" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    try {
    // Call your API to verify credentials
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials.username, // or credentials.email
        password: credentials.password,
      }),
    });

    const data = await res.json();

    if (data.success && data.user) {
      // Return user object that will be stored in JWT
      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      };
    }
    
    return null; // Return null if authentication fails
  } catch (err) {
    throw new Error(err.message);
  }
  },
}),
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }),
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
],
  pages: {
    signIn: "/login",
  },
    session: {
    strategy: "jwt", // ✅ Enable JWT-based sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
}