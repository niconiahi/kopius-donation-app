import {
  Form,
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
    <body className="body">
      <nav>
        <img
          src="public/assets/RGB_symbol gradient.png"
          alt="Logo de Kopius"
          className="logo"
        />
      </nav>
      <div className="information">
        <div className="header">
          <img src="assets/logo-small.png" alt="Imagen de Fundacion si" />
          <h2>{entityDetails.name}</h2>
          <p>{entityDetails.description}</p>
        </div>
      </div>
      <ul>
        {donationOptions.map((option) => {
          return (
            <li key={`donation-Option-${option.id}`} className="subtitulo">
              {option.name}
              <p>{option.description}</p>
            </li>
          );
        })}
      </ul>
      <main>
        <ul>
          {donations.map((donation) => {
            return <li key={`donation-${donation.id}`}>{donation.id}</li>;
          })}
        </ul>
        <Form method="POST">
          <input type="hidden" name="action" value={ACTION.CREATE_DONATION} />
          <input name="name" />
          <button type="submit">Create donation</button>
        </Form>
        {actionData ? (
          <span>Just created the donation {actionData.name}</span>
        ) : null}
      </main>
    </body>
  );
}

async function fetchEntityDetails() {
  return fetch("https://donations.com.ar/entity/1/get")
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
