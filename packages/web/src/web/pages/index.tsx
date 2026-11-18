import { Nav } from "../components/site/nav";
import { Footer, MobileActions } from "../components/site/footer";
import { Hero } from "../components/home/hero";
import { TrustStrip, Categories } from "../components/home/categories";
import { Solutions } from "../components/home/solutions";
import { Ordering } from "../components/home/ordering";
import { Featured } from "../components/home/featured";
import { Benefits } from "../components/home/benefits";
import { Company, CtaBand } from "../components/home/company";

function Index() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Categories />
        <Solutions />
        <Ordering />
        <Featured />
        <Benefits />
        <Company />
        <CtaBand />
      </main>
      <Footer />
      <MobileActions />
    </>
  );
}

export default Index;
