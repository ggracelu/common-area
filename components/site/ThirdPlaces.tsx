import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sticker } from "@/components/ui/Sticker";

const photos = {
  cafeInterior:
    "https://images.unsplash.com/photo-1762770622112-4a708ce0d731?auto=format&fit=crop&w=2200&q=80",
  potteryHands:
    "https://images.unsplash.com/photo-1760018861921-43af85ea6c4f?auto=format&fit=crop&w=2200&q=80",
  bulletinBoard:
    "https://images.unsplash.com/photo-1741636174602-252cd7bb233c?auto=format&fit=crop&w=2200&q=80",
} as const;

export function ThirdPlaces() {
  return (
    <section id="third-places" className="px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <SectionHeader
            eyebrow="Neighborhood third places"
            title="Local businesses are the campus buildings."
            description="Common Area is designed around real places you can return to—cafés, studios, comedy rooms, and neighborhood corners that feel better when you recognize someone."
          />
          <Sticker className="mt-6">Repeated presence makes it easier.</Sticker>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card variant="paper" className="lift-hover">
              <h3 className="text-xl font-semibold">Less planning overhead</h3>
              <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                The place is part of the structure. You show up, do the thing, and the room does some of the social work.
              </p>
            </Card>
            <Card variant="scrapbook" className="lift-hover">
              <h3 className="text-xl font-semibold">More recognition moments</h3>
              <p className="mt-3 text-base leading-7 text-[color:rgba(37,34,30,0.72)]">
                Familiar faces happen when you return to familiar places. That’s the campus feeling.
              </p>
            </Card>
          </div>
        </div>

        <div className="grid gap-5 lg:pt-2">
          <Polaroid
            title="A place to return to"
            caption="Photo via Unsplash."
            tilt="right"
          >
            <img
              src={photos.cafeInterior}
              alt="A cozy cafe interior with warm light and seating."
              loading="lazy"
              decoding="async"
              className="h-56 w-full object-cover"
            />
          </Polaroid>
          <div className="grid gap-5 sm:grid-cols-2">
            <Polaroid title="Hands busy" caption="Photo via Unsplash." tilt="left">
              <img
                src={photos.potteryHands}
                alt="Hands shaping clay on a pottery wheel."
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover"
              />
            </Polaroid>
            <Polaroid title="Flyer wall" caption="Photo via Unsplash." tilt="right">
              <img
                src={photos.bulletinBoard}
                alt="A bulletin board layered with posters and flyers."
                loading="lazy"
                decoding="async"
                className="h-48 w-full object-cover"
              />
            </Polaroid>
          </div>
        </div>
      </div>
    </section>
  );
}

