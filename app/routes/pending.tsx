import type { LinksFunction} from "react-router";

import styles from "~/styles/global.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function () {
  return (
    <>
      <nav className="navbar">
        <a href="http://localhost:5173/playground">
        <img
            className="logo-kopius"
            src="./assets/symbol_gradient.png"
            alt="Logo Kopius"
          />
        </a>

      </nav>
      <main className="state-page">
        <div className="main-content">
          <h1>La donación esta en proceso...</h1>
          <img src="./assets/clock.png" alt="red cross" className="state-image" />
          <h2>La donación se encuentra en proceso</h2>
          <h3 className="thanks">Gracias por contribuir a estas causas</h3>
          <a href="http://localhost:5173/playground">
            <button type="submit" className="return-button">Volver a la página</button>
          </a>
        </div>
      </main>
    </>
  );
}

