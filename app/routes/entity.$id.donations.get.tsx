import type { LoaderFunctionArgs } from "react-router";
import {type Donations, DonationsSchema } from "./playground";
import * as v from "valibot";

export function loader({}:LoaderFunctionArgs){
    const causes: Donations[] = [
        {
          id: 1,
          name: "Programa ´Si pueden´",
          description:
            "Brinda alimentos a personas en situación de vulnerabilidad",
        },
        {
          id: 2,
          name: "Residencias Universitarias",
          description: "Ofrece alojamiento a estudiantes con recursos limitados.",
        },
        {
          id: 3,
          name: "Catastrofes Naturales ",
          description:
            "Responde con ayuda urgente ante emergencias como inundaciones o terremotos.",
        },
      ];
      const data = v.parse(v.array(DonationsSchema), causes);
      return data
}