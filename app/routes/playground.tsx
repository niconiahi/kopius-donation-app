import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "react-router";
import * as v from "valibot";
import styles from "~/styles/global.css?url";
import {fetchFundation} from "app/routes/entity.$id.get"
import {fetchDonations} from "app/routes/entity.$id.donations.get"


export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];


export const FundationSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
});
export type Fundation = v.InferOutput<typeof FundationSchema>;

export const DonationsSchema = v.object({
  id: v.number(),
  name: v.string(),
  description: v.string(),
});
export type Donations = v.InferOutput<typeof DonationsSchema>;

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
              success: "https://donation-kopius.yaelpilarluque.workers.dev/success",
              pending: "https://donation-kopius.yaelpilarluque.workers.dev/pending",
              failure: "https://donation-kopius.yaelpilarluque.workers.dev/failure",
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
  const ENTENTY_ID= 1
  const fundation = await fetchFundation(ENTENTY_ID);
  const donations = await fetchDonations();
  return { fundation, donations };
}

export default function () {
  const { fundation, donations } = useLoaderData<typeof loader>();
  return (
    <>
      <nav className="navbar">
        <img
          className="logo-kopius"
          src="./assets/symbol_gradient.png"
          alt="Logo Kopius"
        />
      </nav>
      <div key={`fundation-${fundation.id}`} className="information">
        <div className="header">
          <img src="./assets/logo-small.png" alt="Logo Fundacion Si" />
          <h1>{fundation.name}</h1>
        </div>
        <p>{fundation.description}</p>
      </div>
      <div className="causes">
        {donations.map((data) => {
          return (
            <div key={`causes-${data.id}`} className="cause-item">
              <b>{data.name}</b>
              <p>{data.description}</p>

              <div className="donation-form">
                <Form method="POST">
                  <input type="hidden" value={1000} name="amount" />
                  <input type="hidden" value={data.name} name="cause" />
                  <input type="hidden" value={ACTION.DONATE} name="action" />
                  <button type="submit" className="button">
                    $1000
                  </button>
                </Form>

                <Form method="POST">
                  <input type="hidden" value={3000} name="amount" />
                  <input type="hidden" value={data.name} name="cause" />
                  <input type="hidden" value={ACTION.DONATE} name="action" />
                  <button type="submit" className="button">
                    $3000
                  </button>
                </Form>

                <Form method="POST">
                  <input type="hidden" value={5000} name="amount" />
                  <input type="hidden" value={data.name} name="cause" />
                  <input type="hidden" value={ACTION.DONATE} name="action" />
                  <button type="submit" className="button">
                    $5000
                  </button>
                </Form>

                <Form method="POST">
                  <input type="hidden" value={10000} name="amount" />
                  <input type="hidden" value={data.name} name="cause" />
                  <input type="hidden" value={ACTION.DONATE} name="action" />
                  <button type="submit" className="button">
                    $10.000
                  </button>
                </Form>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// async function fetchFundation() {
//   return fetch("http://localhost:5173/entity/1/get")
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       const fundation = v.parse(FundationSchema, data);
//       return fundation;
//     });
// }

// async function fetchDonations() {
//   return fetch("http://localhost:5173/entity/1/donations/get")
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       const causes = v.parse(v.array(DonationsSchema), data);
//       return causes;
//     });
// }




