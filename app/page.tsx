import WorkCard from "@/components/WorkCard";
import Reveal from "@/components/Reveal";
import { getWorksSorted } from "@/lib/works";

export default function Home() {
  const works = getWorksSorted();

  return (
    <section className="wrap pb-24 pt-24 sm:pt-28">
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
        {works.map((w, i) => (
          <Reveal key={w.slug} delay={i * 80}>
            <WorkCard work={w} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
