import type { LinksFunction} from "react-router";

import styles from "~/styles/global.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function () {
  return (
    <>
      <nav className="navbar">
        <a href="https://donation-kopius.yaelpilarluque.workers.dev/playground">
        <img
            className="logo-kopius"
            src="./assets/symbol_gradient.png"
            alt="Logo Kopius"
          />
        </a>

      </nav>
      <main className="state-page">
        <div className="main-content">
          <h1>La donación se realizó con exito</h1>
          <img src="./assets/thumbs-up.png" alt="green thumbs up" className="state-image" />
          <h2 className="thanks">Gracias por contribuir con esta causa</h2>
          <a href="https://donation-kopius.yaelpilarluque.workers.dev/playground">
            <button type="submit" className="return-button">Volver a la página</button>
          </a>
        </div>
      </main>
    </>
  );
}
