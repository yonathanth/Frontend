import Header from "./components/Header";
import Footer from "./components/Footer";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false;
import OurServices from "./components/OurServices";
import Shop from "./components/Shops";
import Supporting from "./components/Supporting";
import Contact from "./components/Contact";
import Hero from "./components/Hero";
import About from "./components/About";

import Testimonials from "./components/Testimonials";
export default function Home() {
  return (
    <body>
      <main>
        <Header />

        <Hero />
        <About />
        <OurServices />
        <Shop />
        <Supporting />
        <Testimonials />
        <Contact />

        <Footer />
      </main>
    </body>
  );
}
