import { useSeo } from "@/hooks/use-seo";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Services } from "@/components/portfolio/Services";
import { Experience } from "@/components/portfolio/Experience";
import { Work } from "@/components/portfolio/Work";
import { Community } from "@/components/portfolio/Community";
import { Skills } from "@/components/portfolio/Skills";
import { Certifications } from "@/components/portfolio/Certifications";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";

export function HomePage() {
  useSeo({
    title: "Fahad Al Noman | Web Developer & Designer in Malta",
    description:
      "Freelance web developer and designer in Malta building fast React, Next.js, Laravel & WordPress sites. SEO and UI/UX for clients in Malta, the EU & worldwide.",
    path: "/",
  });

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <FloatingOrbs />
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <Experience />
        <Work />
        <Community />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
