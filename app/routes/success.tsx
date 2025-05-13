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
          <h1>Pago Exitoso</h1>
        </div>
        <p>Gracias. Tu pago ha sido procesado correctamente.</p>
        <span className="success-message">¡Transacción completada!</span>
      </section>
    </div>
  );
}
