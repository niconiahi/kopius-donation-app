import { http, HttpResponse } from "msw";
import * as v from "valibot";
import {
  DonationSchema,
  FundationSchema,
  NameSchema,
  type Donation,
  type Fundation,
  type Causes,
  CausesSchema,
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
    const causes: Causes[] = [
      {
        id: 1,
        name: "Programa ´Si pueden´",
      },
      {
        id: 2,
        name: "Residencias Universitarias",
      },
      {
        id: 3,
        name: "Catastrofes Naturales ",
      },
    ];
    const data = v.parse(v.array(CausesSchema), causes);
    return HttpResponse.json(data);
  }),
  http.get("https://donations.com.ar/entity/1/get", () => {
    const fundation: Fundation = {
      id: 1,
      name: "Fundacion Si",
      description:
        "Fundación Sí es una organización sin fines de lucro argentina dedicad a promover la inclusión social de los sectores más vulnerables del país. Desde su creación en 2012 por Manuel Lozano y un grupo de voluntarios, impulsa proyectos solidarios que abarcan áreas como  asistencia, contención, capacitación, educación y cultura del trabajo. Su labor se sostiene gracias al compromiso de miles de voluntarios y donaciones de particulares y empresas, sin que ningún integrante reciba remuneración por su trabajo",
    };
    const data = v.parse(FundationSchema, fundation);
    return HttpResponse.json(data);
  }),
];
