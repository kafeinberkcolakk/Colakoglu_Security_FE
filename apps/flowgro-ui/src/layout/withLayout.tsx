import type { ReactNode } from "react";

const withLayout = (PageContent: ReactNode) => {
  return function fn() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100%",
        }}
      >
        <main style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          {PageContent}
        </main>
      </div>
    );
  };
};

export default withLayout;
