import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsletterPopup } from "@/components/NewsletterPopup";

// Sitenin normal sayfaları — header + footer + bülten popup burada.
// /vsl gibi funnel sayfaları bu grubun DIŞINDA olduğu için chrome almaz.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">İçeriğe geç</a>
      <Header />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <NewsletterPopup />
    </>
  );
}
