import * as v from "valibot";
import { DonationOptionsSchema, type DonationOptions } from "./playground";

export async function loader() {
  const donationOptions: DonationOptions[] = [
    {
      id: 1,
      name: "Inundaciones en Bahia blanca",
      description:
        "Las recientes inundaciones en Bahía Blanca han afectado a cientos de familias que hoy necesitan nuestra ayuda. Podés colaborar con una donación que será destinada a financiar asistencia urgente: alimentos, ropa, agua potable y elementos de limpieza.",
    },
    {
      id: 2,
      name: "Un plato de comida para",
      description:
        "su ayuda puede marcar la diferencia. Estamos recibiendo donaciones para colaborar con un comedor infantil que brinda alimento diario a niñas y niños en situación de vulnerabilidad. Con tu aporte, contribuís a que más chicos puedan acceder a una comida digna y nutritiva cada día.",
    },
    {
      id: 3,
      name: "Refugio animal",
      description:
        "su contribución es fundamental para mejorar la vida de nuestros amigos de cuatro patas. Estamos recibiendo donaciones destinadas a un refugio animal que ofrece cuidado, alimentos y un ambiente seguro para mascotas sin hogar. Con tu aporte, ayudás a proporcionar atención veterinaria, alimento equilibrado y recursos esenciales que harán la diferencia en la vida de estos animales.",
    },
  ];
  const data = v.parse(v.array(DonationOptionsSchema), donationOptions);
  return data;
}
