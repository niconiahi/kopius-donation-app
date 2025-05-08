import { EntitySchema, type Entity } from "./playground";
import * as v from "valibot";

export async function loader() {
  const entity: Entity = {
    name: "Fundacion si",
    description:
      "Fundación Sí es una organización sin fines de lucro que trabaja para promover la inclusión social a través de la educación, el acompañamiento y la solidaridad.Impulsamos proyectos en todo el país enfocados en la igualdad de oportunidades, brindando apoyo a personas en situación de vulnerabilidad, acompañando a estudiantes universitarios sin recursos, colaborando con comedores comunitarios, refugios y acciones de emergencia.Nuestro compromiso es generar redes de apoyo reales y sostenibles, movilizando la empatía y la acción ciudadana para construir una sociedad más justa.",
  };
  const data = v.parse(EntitySchema, entity);
  return data;
}
