import {type Donations, DonationsSchema } from "./playground";
import * as v from "valibot";

const DONATIONS:Donations[]=[
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


  export async function loader(){
      const donations= await fetchDonations();
      return donations;
  }
  
  export async function fetchDonations(){
      const fundation=v.parse(v.array(DonationsSchema),DONATIONS)
      return fundation;
  }