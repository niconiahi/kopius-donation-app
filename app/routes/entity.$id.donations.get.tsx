import type { LoaderFunctionArgs } from "react-router";
import {type Donations, DonationsSchema } from "./playground";
import * as v from "valibot";

const DONATIONS:Donations[]=[
    {
      id: 1,
      name: "Programa ´Si pueden´",
      description:
        "Brinda alimentos a personas en situación de vulnerabilidad",
      entity_id:1,
    },
    {
      id: 2,
      name: "Residencias Universitarias",
      description: "Ofrece alojamiento a estudiantes con recursos limitados.",
      entity_id:1,
    },
    {
      id: 3,
      name: "Catastrofes Naturales ",
      description:
        "Responde con ayuda urgente ante emergencias como inundaciones o terremotos.",
      entity_id:1,
    },
  ];


  export async function loader({params}:LoaderFunctionArgs){
      const entity_id= v.parse(v.pipe(v.string(),v.transform(Number)), params.id);
      const donations= await fetchDonations(entity_id);
      return donations;
  }
  
  export async function fetchDonations(id:Number){
      const entity_id= DONATIONS.filter((donation)=> donation.entity_id===id)
      const donations=v.parse(v.array(DonationsSchema),entity_id)
      return donations;
  }