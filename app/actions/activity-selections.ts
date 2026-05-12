"use server";

import { saveDemoActivitySelectionsForAuthenticatedUser } from "@/lib/activity-selections";

export async function saveDemoActivitySelectionsAction(demoEventIds: string[]) {
  return saveDemoActivitySelectionsForAuthenticatedUser(demoEventIds);
}
