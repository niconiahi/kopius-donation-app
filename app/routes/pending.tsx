import stylesUrl from "../../src/styles.css?url";

export function links() {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function () {
  return (
    <div className="container">
      <nav className="navbar">
        <img src="/logo.png" alt="Logo" className="navbar-logo" />
      </nav>

      <section className="information card">
        <div className="entity-header">
          <img src="/logo.png" alt="Entidad" className="entity-logo" />
          <h1>Pago Pendiente</h1>
        </div>
        <p>
          Tu pago está pendiente. Por favor, completa el proceso para continuar.
        </p>
        <p className="monto">$1,250.00 MXN</p>
      </section>
    </div>
  );
}
