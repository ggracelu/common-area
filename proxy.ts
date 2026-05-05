import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/season/select(.*)",
  "/cohort(.*)",
  "/cohort/chat(.*)",
  "/bingo(.*)",
  "/profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes if Clerk is properly configured
  if (isProtectedRoute(req) && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
