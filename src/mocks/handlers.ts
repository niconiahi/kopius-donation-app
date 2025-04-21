import { http, HttpResponse } from "msw";
import * as v from "valibot";
import { DonationSchema, NameSchema, type Donation } from "~/routes/playground";

export const handlers = [
  http.get("https://donations.com.ar/donations", () => {
    // INFO: read donations from database
    const donations: Donation[] = [
      { id: 1, name: "Some donation" },
      { id: 2, name: "Some other donation" },
    ];
    const data = v.parse(v.array(DonationSchema), donations);
    return HttpResponse.json(data);
  }),
  http.post("https://donations.com.ar/donation/create", async ({ request }) => {
    const formData = await request.formData();
    const name = v.parse(NameSchema, formData.get("name"));
    // INFO: insert in database
    // INFO: query the new row in database
    // INFO: return data
    const donation: Donation = {
      id: Math.floor(Math.random() * 100000),
      name,
    };
    const data = v.parse(DonationSchema, donation);
    return HttpResponse.json(data);
  }),
  http.get("https://donations.com.ar/entity/1/donations/get", () => {
    // TODO: return donations for the entity 1
  }),
  http.get("https://donations.com.ar/entity/1/get", () => {
    // TODO: return the detail information for entity 1
  }),
];
