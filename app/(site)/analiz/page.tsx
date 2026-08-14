export const metadata = {
  title: "Ücretsiz Online Koçluk Analizi",
  description:
    "20 soruluk ücretsiz analiz — online koçluk işini 4 büyüme alanında tarar; nerede takıldığını ve önümüzdeki 12 haftada neye odaklanman gerektiğini gösterir.",
  alternates: { canonical: "/analiz" },
};

export default function AnalizPage() {
  return (
    <iframe
      title="Ücretsiz Online Koçluk Analizi"
      src="/analiz.html"
      className="w-full"
      style={{ height: "calc(100vh - 4rem)", border: "0" }}
    />
  );
}
