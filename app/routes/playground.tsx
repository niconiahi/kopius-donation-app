import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  type ActionFunctionArgs,
  type LinksFunction,
} from "react-router";
import * as v from "valibot";

import stylesUrl from "../../src/styles.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const EntitySchema = v.object({
  name: v.string(),
  description: v.string(),
});

export const DonationOptionsSchema = v.object({
  id: v.number(),
  name: v.pipe(v.string(), v.minLength(2)),
  description: v.string(),
});

export const NameSchema = v.pipe(v.string(), v.minLength(5));

export const DonationSchema = v.object({
  id: v.number(),
  name: NameSchema,
});
export type Donation = v.InferOutput<typeof DonationSchema>;
export type DonationOptions = v.InferOutput<typeof DonationOptionsSchema>;
export type Entity = v.InferOutput<typeof EntitySchema>;

const ACTION = {
  CREATE_DONATION: "create-donation",
  PAY_DONATION: "pay_donation",
} as const;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");
  switch (action) {
    case ACTION.CREATE_DONATION: {
      const donation = await fetch("https://donations.com.ar/donation/create", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const donation = v.parse(DonationSchema, data);
          return donation;
        });
      return donation;
    }

    case ACTION.PAY_DONATION: {
      const amount = v.parse(
        v.pipe(
          v.string(),
          v.transform((input) => {
            return Number(input);
          }),
        ),
        formData.get("amount"),
      );
      const name = v.parse(v.string(), formData.get("name"));
      console.log("amount", amount);
      console.log("name", name);
      const mercadoPago = await fetch(
        "https://api.mercadopago.com/checkout/preferences",
        {
          method: "POST",
          headers: {
            Authorization:
              "Bearer TEST-4898188942735923-042908-f6d36dbbf769f319dea2a3a3a3086d81-441865369",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              {
                title: name,
                quantity: 1,
                unit_price: amount,
              },
            ],
            back_urls: {
              success: "https://test.com/success",
              pending: "https://test.com/pending",
              failure: "https://test.com/failure",
            },
          }),
        },
      )
        .then((response) => {
          return response.json();
        })
        .catch((error) => {
          console.log("error", error);
        });
      throw redirect(mercadoPago.sandbox_init_point);
    }
  }
}

export async function loader() {
  const donations = await fetchDonations();
  const donationOptions = await fetchDonationOptions();
  const entityDetails = await fetchEntityDetails();
  return { donations, donationOptions, entityDetails };
}

export default function () {
  const { donations, donationOptions, entityDetails } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <body className="body container">
      <nav className="navbar">
        <img
          src="public/assets/RGB_symbol gradient.png"
          alt="Logo de Kopius"
          className="logo navbar-logo"
        />
      </nav>
      <div className="information card">
        <div className="header entity-header">
          <img
            src="assets/logo-small.png"
            alt="Imagen de Fundacion si"
            className="entity-logo"
          />
          <h2>{entityDetails.name}</h2>
          <p>{entityDetails.description}</p>
        </div>
      </div>
      <ul className="donation-options">
        {donationOptions.map((option) => {
          return (
            <div
              key={`donation-Option-${option.id}`}
              className="donation-option"
            >
              <li className="subtitulo option-title">
                {option.name}
                <p>{option.description}</p>
              </li>
              <Form method="POST" className="donation-form">
                <input
                  type="hidden"
                  name="action"
                  value={ACTION.PAY_DONATION}
                />
                <input type="hidden" name="name" value={option.name} />
                <input type="hidden" value={1000} name="amount" />
                <button type="submit" className="donation-button">
                  1000
                </button>
              </Form>
              <Form method="POST" className="donation-form">
                <input
                  type="hidden"
                  name="action"
                  value={ACTION.PAY_DONATION}
                />
                <input type="hidden" name="name" value={option.name} />
                <input type="hidden" value={2000} name="amount" />
                <button type="submit" className="donation-button">
                  2000
                </button>
              </Form>
              <Form method="POST" className="donation-form">
                <input
                  type="hidden"
                  name="action"
                  value={ACTION.PAY_DONATION}
                />
                <input type="hidden" name="name" value={option.name} />
                <input type="hidden" value={5000} name="amount" />
                <button type="submit" className="donation-button">
                  5000
                </button>
              </Form>
              <Form method="POST" className="donation-form">
                <input
                  type="hidden"
                  name="action"
                  value={ACTION.PAY_DONATION}
                />
                <input type="hidden" name="name" value={option.name} />
                <input type="hidden" value={10000} name="amount" />
                <button type="submit" className="donation-button">
                  10000
                </button>
              </Form>
            </div>
          );
        })}
      </ul>
      <main className="main">
        <ul className="donations-list">
          {donations.map((donation) => {
            return (
              <li key={`donation-${donation.id}`} className="donation-item">
                {donation.id}
              </li>
            );
          })}
        </ul>
        <Form method="POST" className="create-donation-form">
          <input type="hidden" name="action" value={ACTION.CREATE_DONATION} />
          <input name="name" className="input-name" />
          <button type="submit" className="create-button">
            Create donation
          </button>
        </Form>
        {actionData ? (
          <span className="success-message">
            Just created the donation {actionData.name}
          </span>
        ) : null}
      </main>
    </body>
  );
}

async function fetchEntityDetails() {
  return fetch("http://localhost:5173/entity/1/get")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const entityDetails = v.parse(EntitySchema, data);
      return entityDetails;
    });
}

async function fetchDonationOptions() {
  return fetch("https://donations.com.ar/entity/1/donations/get")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const donationOption = v.parse(v.array(DonationOptionsSchema), data);
      return donationOption;
    });
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
