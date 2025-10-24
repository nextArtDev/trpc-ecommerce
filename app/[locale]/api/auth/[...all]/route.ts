import { auth } from '@/lib/auth' // path to your auth file
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)

//Getting Session on rsc

// import { auth } from '@/lib/auth'
// import { headers } from 'next/headers'

// export async function ServerComponent() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })
//   if (!session) {
//     return <div>Not authenticated</div>
//   }
//   return (
//     <div>
//       <h1>Welcome {session.user.name}</h1>
//     </div>
//   )
// }

// Sign up
//await authClient.signOut();

// await authClient.signOut({
//   fetchOptions: {
//     onSuccess: () => {
//       router.push('/login') // redirect to login page
//     },
//   },
// })

//Client Side
//    const {
//      data: session,
//      isPending, //loading state
//      error, //error object
//      refetch, //refetch the session
//    } = authClient.useSession()

// client, not hook

// import { authClient } from '@/lib/auth-client' // import the auth client

// const { data: session, error } = await authClient.getSession()
