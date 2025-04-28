import {
  data,
  Form,
  redirect,
  useActionData,
  useLoaderData,
  type ActionFunctionArgs,
  type LinksFunction,
} from "react-router";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import * as v from "valibot";
import styles from "src/styles/global.css?url";

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
  DONATE_1K: "donate-1k",
  DONATE_3K: "donate-3k",
  DONATE_5K: "donate-5k",
  DONATE_10k: "donate-10k",
} as const;

function getAmountByAction(action: FormDataEntryValue | null) {
  switch (action) {
    case ACTION.DONATE_1K:
      return 1000;
    case ACTION.DONATE_3K:
      return 3000;
    case ACTION.DONATE_5K:
      return 5000;
    case ACTION.DONATE_10k:
      return 10000;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  const value = getAmountByAction(action);
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
            id: 1,
            title: "${value}",
            quantity: 1,
            unit_price: value,
          },
        ],
        back_urls: {
          success: "https://test.com/success",
          pending: "https://test.com/pending",
          failure: "https://test.com/failure",
        },
        auto_return: "approved",
      }),
    },
  ).then((response) => {
    return response.json();
  });
  throw redirect(preferences.init_point);
}

export async function loader() {
  const donations = await fetchDonations();
  const fundation = await fetchFundation();
  const causes = await fetchCauses();
  return { donations, fundation, causes };
}

export default function () {
  const { donations, fundation, causes } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
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
        {causes.map((data) => {
          return (
            <div key={`causes-${data.id}`} className="cause-item">
              <b>{data.name}</b>
              <p>{data.description}</p>
              <Form method="POST" className="donation-form">
                <input type="hidden" value={ACTION.DONATE_1K} name="action" />
                <button type="submit" className="donation-button">
                  $1000
                </button>

                <input type="hidden" value={ACTION.DONATE_3K} name="action" />
                <button type="submit" className="donation-button">
                  $3000
                </button>

                <input type="hidden" value={ACTION.DONATE_5K} name="action" />
                <button type="submit" className="donation-button">
                  $5000
                </button>

                <input type="hidden" value={ACTION.DONATE_10k} name="action" />
                <button type="submit" className="donation-button">
                  $10.000
                </button>
              </Form>
            </div>
          );
        })}
      </div>
    </>
  );
}

async function fetchDonations() {
  return fetch("https://donations.com.ar/donations")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const donations = v.parse(v.array(DonationSchema), data);
      return donations;
    });
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
