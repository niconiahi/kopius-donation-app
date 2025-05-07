import type { LoaderFunctionArgs } from "react-router";
import {type Fundation, FundationSchema } from "./playground";
import * as v from "valibot";

export function loader({}:LoaderFunctionArgs){
    const fundation: Fundation = {
        id: 1,
        name: "Fundacion Si",
        description:
          "Fundación Sí es una organización sin fines de lucro argentina dedicad a promover la inclusión social de los sectores más vulnerables del país. Desde su creación en 2012 por Manuel Lozano y un grupo de voluntarios, impulsa proyectos solidarios que abarcan áreas como  asistencia, contención, capacitación, educación y cultura del trabajo. Su labor se sostiene gracias al compromiso de miles de voluntarios y donaciones de particulares y empresas, sin que ningún integrante reciba remuneración por su trabajo",
      };
      const data = v.parse(FundationSchema, fundation);
      return data
}