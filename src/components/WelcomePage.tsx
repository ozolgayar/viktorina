"use client";

import Image from "next/image";
import Link from "next/link";
import { WelcomeFestiveDecor } from "@/components/WelcomeFestiveDecor";

/** Заставка — праздничный экран к 25-летию */
export function WelcomePage() {
  return (
    <div className="welcome-page">
      <div className="welcome-desktop">
        <WelcomeFestiveDecor />

        <div className="welcome-stack">
          <div className="welcome-hero">
            <div className="welcome-balloons">
              <Image
                src="/welcome/balloon-2.png"
                alt="2"
                width={360}
                height={440}
                className="welcome-balloon welcome-balloon--2"
                priority
                unoptimized
              />
              <Image
                src="/welcome/balloon-5.png"
                alt="5"
                width={360}
                height={440}
                className="welcome-balloon welcome-balloon--5"
                priority
                unoptimized
              />
            </div>

            <div className="welcome-cake-wrap">
              <Image
                src="/welcome/cake.png"
                alt=""
                width={280}
                height={280}
                className="welcome-cake"
                priority
                unoptimized
              />
            </div>
          </div>

          <div className="welcome-copy">
            <h1 className="welcome-title">ГЕРОФАРМ</h1>
            <Link href="/quiz" className="welcome-btn">
              Открыть викторину
            </Link>
          </div>
        </div>
      </div>

      <div className="welcome-mobile">
        <Image
          src="/welcome/mobile-hero.png"
          alt="ГЕРОФАРМ — 25 лет вместе с вами"
          width={291}
          height={518}
          className="welcome-mobile__hero"
          priority
          unoptimized
        />
        <Link href="/quiz" className="welcome-btn welcome-mobile__btn">
          Открыть викторину
        </Link>
      </div>
    </div>
  );
}
