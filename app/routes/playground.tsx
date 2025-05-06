import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LinksFunction,
} from "react-router";
import { initMercadoPago } from "@mercadopago/sdk-react";
import * as v from "valibot";
import styles from "~/styles/global.css?url";

initMercadoPago("TEST-c82e5505-3f42-4d4f-9b3d-f32246048daf");

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const NameSchema = v.pipe(v.string(), v.minLength(5));
export const DonationSchema = v.object({
  id: v.number(),
  name: NameSchema,
});
export type Donation = v.InferOutput<typeof DonationSchema>;

export const FundationSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
});
export type Fundation = v.InferOutput<typeof FundationSchema>;

export const CausesSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
});
export type Causes = v.InferOutput<typeof CausesSchema>;

const ACTION = {
  CREATE_DONATION: "create-donation",
  DONATE: "donate",
} as const;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  const amount = Number(formData.get("amount"));
  const cause= formData.get("cause")
  switch (action) {
    case ACTION.DONATE: {
      const preferences = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer TEST-441491382271261-042511-f6094ffb0b9fd2f965a59c191dd93a09-660855927",
          },
          body: JSON.stringify({
            items: [
              {
                title: cause,
                quantity: 1,
                unit_price: amount,
              },
            ],
            back_urls: {
              success: "https://mydomain.com/success",
              pending: "https://mydomain.com/pending",
              failure: "https://mydomain.com/failure",
            },
            auto_return: "approved",
          }),
        },
      ).then((response) => {
        return response.json();
      });
      throw redirect((preferences as any).init_point as any);
    }
  }
}

export async function loader() {
  // const fundation = await fetchFundation();
  // const causes = await fetchCauses();
  // return { fundation, causes };
  const data= await fetch("http://localhost:5173/test").then((response)=> response.json())
  console.log("DATA",data)
  return null
}

export default function () {
  return (
    <h1>HOLA</h1>
  )
  // const { fundation, causes } = useLoaderData<typeof loader>();
  // return (
  //   <>
  //     <nav className="navbar">
  //       <img
  //         className="logo-kopius"
  //         src="./assets/symbol_gradient.png"
  //         alt="Logo Kopius"
  //       />
  //     </nav>
  //     <div key={`fundation-${fundation.id}`} className="information">
  //       <div className="header">
  //         <img src="./assets/logo-small.png" alt="Logo Fundacion Si" />
  //         <h1>{fundation.name}</h1>
  //       </div>
  //       <p>{fundation.description}</p>
  //     </div>
  //     <div className="causes">
  //       {causes.map((data) => {
  //         return (
  //           <div key={`causes-${data.id}`} className="cause-item">
  //             <b>{data.name}</b>
  //             <p>{data.description}</p>

  //             <div className="donation-form">
  //               <Form method="POST">
  //                 <input type="hidden" value={1000} name="amount" />
  //                 <input type="hidden" value={data.name} name="cause" />
  //                 <input type="hidden" value={ACTION.DONATE} name="action" />
  //                 <button type="submit" className="button">
  //                   $1000
  //                 </button>
  //               </Form>

  //               <Form method="POST">
  //                 <input type="hidden" value={3000} name="amount" />
  //                 <input type="hidden" value={data.name} name="cause" />
  //                 <input type="hidden" value={ACTION.DONATE} name="action" />
  //                 <button type="submit" className="button">
  //                   $3000
  //                 </button>
  //               </Form>

  //               <Form method="POST">
  //                 <input type="hidden" value={5000} name="amount" />
  //                 <input type="hidden" value={data.name} name="cause" />
  //                 <input type="hidden" value={ACTION.DONATE} name="action" />
  //                 <button type="submit" className="button">
  //                   $5000
  //                 </button>
  //               </Form>

  //               <Form method="POST">
  //                 <input type="hidden" value={10000} name="amount" />
  //                 <input type="hidden" value={data.name} name="cause" />
  //                 <input type="hidden" value={ACTION.DONATE} name="action" />
  //                 <button type="submit" className="button">
  //                   $10.000
  //                 </button>
  //               </Form>
  //             </div>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </>
  // );
}

async function fetchFundation() {
  return fetch("https://donations.com.ar/entity/1/get")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const fundation = v.parse(FundationSchema, data);
      return fundation;
    });
}

async function fetchCauses() {
  return fetch("https://donations.com.ar/entity/1/donations/get")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const causes = v.parse(v.array(CausesSchema), data);
      return causes;
    });
}




