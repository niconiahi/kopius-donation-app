import { http, HttpResponse } from "msw";
import * as v from "valibot";
import {
  DonationSchema,
  NameSchema,
  DonationOptionsSchema,
  EntitySchema,
  type Donation,
  type DonationOptions,
  type Entity,
} from "~/routes/playground";

export const handlers = [
  http.get("https://donations.com.ar/donations", () => {
    // INFO: read donations from database
    const donations: Donation[] = [
      { id: 1, name: "Some donation" },
      { id: 2, name: "Some other donation" },
    ];
    const data = v.parse(v.array(DonationSchema), donations);
    return HttpResponse.json(data);
  }),
  http.post("https://donations.com.ar/donation/create", async ({ request }) => {
    const formData = await request.formData();
    const name = v.parse(NameSchema, formData.get("name"));
    // INFO: insert in database
    // INFO: query the new row in database
    // INFO: return data
    const donation: Donation = {
      id: Math.floor(Math.random() * 100000),
      name,
    };
    const data = v.parse(DonationSchema, donation);
    return HttpResponse.json(data);
  }),
  http.get("https://donations.com.ar/entity/1/donations/get", () => {
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
    return HttpResponse.json(data);
  }),
  http.get("https://donations.com.ar/entity/1/get", () => {
    const entity: Entity = {
      name: "Fundacion si",
      description:
        "Fundación Sí es una organización sin fines de lucro que trabaja para promover la inclusión social a través de la educación, el acompañamiento y la solidaridad.Impulsamos proyectos en todo el país enfocados en la igualdad de oportunidades, brindando apoyo a personas en situación de vulnerabilidad, acompañando a estudiantes universitarios sin recursos, colaborando con comedores comunitarios, refugios y acciones de emergencia.Nuestro compromiso es generar redes de apoyo reales y sostenibles, movilizando la empatía y la acción ciudadana para construir una sociedad más justa.",
    };
    const data = v.parse(EntitySchema, entity);
    return HttpResponse.json(data);
  }),
];
