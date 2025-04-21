///YAE
import {
  Form,
  useActionData,
  useLoaderData,
  type ActionFunctionArgs,
  type LinksFunction
} from "react-router";

import * as v from "valibot";


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
    <div className="navbar"
       style={{
        backgroundColor: '#f8f9fa', 
        padding: '1rem', 
        display: 'flex', 
        alignItems: 'center',
      }}
    >
      <img src="./assets/kopius-star.png" alt="Logo Kopius" 
      style={{
          height: '40px',
        }}/>
    </div>
    <div className="information">
      <h1>Fundacion Si</h1>
    <img src="./assets/fundacion-si.png" alt="Logo Fundacion Si" />
    <h2>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat et, consectetur inventore consequuntur adipisci fugiat commodi aut nulla esse ducimus. Sint, quo sunt! Ad saepe tempora maxime sit praesentium porro!</h2>
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
