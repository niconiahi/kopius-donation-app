import {
  data,
  Form,
  useActionData,
  useLoaderData,
  type ActionFunctionArgs,
  type LinksFunction,
} from "react-router";

import * as v from "valibot";
import styles from "src/styles/navbar.css?url";
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
});
export type Causes = v.InferOutput<typeof CausesSchema>;

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
              {data.name}
            </div>
          );
        })}
      </div>
      {/* <main>
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
      </main> */}
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