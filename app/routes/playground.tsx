import {
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

const ACTION = {
  CREATE_DONATION: "create-donation",
} as const;

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
  return { donations };
}

export default function () {
  const { donations } = useLoaderData<typeof loader>();
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
      <div className="information">
        <div className="header">
          <img src="./assets/logo-small.png" alt="Logo Fundacion Si" />
          <h1>Fundación Si</h1>
        </div>
        <h2>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
          inventore suscipit necessitatibus explicabo accusantium alias nesciunt
          blanditiis quidem ratione nihil, quaerat aut delectus vitae eius,
          eaque tempore debitis iusto consectetur.
        </h2>
      </div>
      <div className="causes">
        <a href="/pagina1" className="cause-item">
          <h3>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</h3>
        </a>
        <a href="/pagina2" className="cause-item">
          <h3>Causa ......</h3>
        </a>
        <a href="/pagina3" className="cause-item">
          <h3>Causa....</h3>
        </a>
      </div>
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
    </>
  );
}
