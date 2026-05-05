// Temporary middleware - Clerk authentication disabled
// Re-enable by restoring proxy.ts.backup and configuring Clerk keys

export default function proxy() {
  // Pass-through - no authentication
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
