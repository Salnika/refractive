import type { CSSProperties } from "react";

export const storyFontFamily = '"Google Sans", "Product Sans", "Helvetica Neue", Arial, sans-serif';

const bandStyles: Array<CSSProperties & { key: string }> = [
  {
    key: "rose",
    background: "linear-gradient(135deg, #ff4d8d 0%, #ffb36b 100%)",
    height: 280,
    left: "-8%",
    top: 100,
    transform: "rotate(-14deg)",
    width: "70%",
  },
  {
    key: "cyan",
    background: "linear-gradient(135deg, #16d9e3 0%, #46a6ff 55%, #6d5dfc 100%)",
    height: 220,
    right: "-12%",
    top: 380,
    transform: "rotate(18deg)",
    width: "64%",
  },
  {
    key: "lime",
    background: "linear-gradient(135deg, #c8ff4d 0%, #2ee59d 100%)",
    height: 180,
    left: "18%",
    top: 760,
    transform: "rotate(8deg)",
    width: "48%",
  },
  {
    key: "violet",
    background: "linear-gradient(135deg, #8057ff 0%, #f85fd0 100%)",
    height: 260,
    right: "8%",
    top: 1060,
    transform: "rotate(-10deg)",
    width: "54%",
  },
];

const tileStyles: Array<CSSProperties & { key: string }> = [
  {
    key: "spectrum",
    background: "linear-gradient(135deg, #141414 0%, #303844 100%)",
    borderColor: "rgba(255, 255, 255, 0.28)",
    gridColumn: "span 7",
    minHeight: 300,
  },
  {
    key: "signal",
    background: "linear-gradient(135deg, #ffdf6e 0%, #ff6b6b 100%)",
    color: "#17120a",
    gridColumn: "span 5",
    minHeight: 300,
  },
  {
    key: "field",
    background: "linear-gradient(135deg, #24d3ee 0%, #4d68ff 100%)",
    gridColumn: "span 4",
    minHeight: 220,
  },
  {
    key: "phase",
    background: "linear-gradient(135deg, #f7f4ea 0%, #dce6ff 100%)",
    color: "#172033",
    gridColumn: "span 8",
    minHeight: 220,
  },
];

export const ExampleArticle: React.FC = () => {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #f7f4ea 0%, #dbe9ff 34%, #f4e2ff 68%, #f7f4ea 100%)",
        color: "#10131a",
        fontFamily: storyFontFamily,
        minHeight: 1500,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(16, 19, 26, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 19, 26, 0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          inset: 0,
          maskImage: "linear-gradient(180deg, black 0%, transparent 92%)",
          position: "absolute",
        }}
      />

      {bandStyles.map(({ key, ...style }) => (
        <div
          key={key}
          style={{
            ...style,
            border: "1px solid rgba(255, 255, 255, 0.45)",
            borderRadius: 8,
            boxShadow: "0 28px 80px rgba(24, 31, 54, 0.22)",
            opacity: 0.92,
            position: "absolute",
          }}
        />
      ))}

      <main
        style={{
          margin: "0 auto",
          maxWidth: 1040,
          padding: "88px 32px 140px",
          position: "relative",
        }}
      >
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0,
            margin: "0 0 18px",
            textTransform: "uppercase",
          }}
        >
          Optical field 04
        </p>
        <h1
          style={{
            fontSize: "clamp(72px, 13vw, 168px)",
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 0.82,
            margin: 0,
            maxWidth: 980,
          }}
        >
          REFRACTIVE
        </h1>
        <p
          style={{
            fontSize: "clamp(22px, 3vw, 44px)",
            fontWeight: 700,
            lineHeight: 1.05,
            margin: "24px 0 76px",
            maxWidth: 680,
          }}
        >
          Chromatic shapes, hard edges, soft light, and layered depth.
        </p>

        <section
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          }}
        >
          {tileStyles.map(({ key, ...style }) => (
            <article
              key={key}
              style={{
                ...style,
                border: `1px solid ${style.borderColor ?? "rgba(255, 255, 255, 0.48)"}`,
                borderRadius: 8,
                boxShadow: "0 24px 70px rgba(18, 24, 38, 0.18)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
                padding: 28,
                position: "relative",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(90deg, currentColor 0 18%, transparent 18% 24%, currentColor 24% 52%, transparent 52% 58%, currentColor 58% 100%)",
                  height: 10,
                  opacity: 0.2,
                  width: "100%",
                }}
              />
              <strong
                style={{
                  fontSize: "clamp(28px, 4vw, 58px)",
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 0.9,
                  textTransform: "uppercase",
                }}
              >
                {key}
              </strong>
            </article>
          ))}
        </section>

        <section
          style={{
            alignItems: "stretch",
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            marginTop: 18,
          }}
        >
          {["Prism", "Surface", "Light"].map((label) => (
            <div
              key={label}
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.66) 0%, rgba(255,255,255,0.24) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.58)",
                borderRadius: 8,
                minHeight: 190,
                padding: 24,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing: 0,
                  lineHeight: 1,
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};
