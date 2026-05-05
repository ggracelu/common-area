"use client";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { resetDemoState } from "@/lib/demo-state";

export function DemoNotice() {
  return (
    <Card variant="paper" className="relative overflow-hidden">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="butter">Demo mode</Badge>
          <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.74)]">
            Your selections, matching, bingo, and chat are stored <span className="font-semibold">on this device only</span>.
            Nothing here implies real payment, assignment, or realtime messaging.
          </p>
          <Sticker className="mt-4">Crumbs filed this under “visible progress.”</Sticker>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            resetDemoState();
            window.location.reload();
          }}
        >
          Reset demo progress
        </Button>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_center,rgba(191,90,54,0.25),transparent_62%)]"
      />
    </Card>
  );
}

