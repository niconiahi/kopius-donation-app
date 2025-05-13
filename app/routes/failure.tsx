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
          <h1>Pago Fallido</h1>
        </div>
        <p>No se pudo procesar tu pago. Por favor, intentá nuevamente.</p>
        <span className="error-message">Hubo un error en la transacción.</span>
      </section>
    </div>
  );
}
