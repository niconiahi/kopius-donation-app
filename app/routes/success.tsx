import type { LinksFunction } from "react-router";
import { Link } from "react-router";

import styles from "src/styles/global.css?url";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function () {
  return (
    <>
      <nav className="navbar">
        <Link to="http://localhost:5173/playground">
          <img
            className="logo-kopius"
            src="./assets/symbol_gradient.png"
            alt="Logo Kopius"
          />
        </Link>
      </nav>
    </>
  );
}
