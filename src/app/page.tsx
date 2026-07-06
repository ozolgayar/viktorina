import { WelcomePage } from "@/components/WelcomePage";

/** Первый экран — заставка */
export default function Home() {
  return (
    <>
      <WelcomePage />
      <section className="welcome-after-hero" aria-hidden />
    </>
  );
}