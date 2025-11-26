import React from "react";
import { updateCompany } from "@/lib/actions/company.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCompanies } from "@/lib/actions/company.actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditCompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const companies = await fetchCompanies();
  const company = companies.find((c) => c._id.toString() === params.id);

  if (!company) {
    redirect("/admin/companies");
  }

  const editCompany = async (formData: FormData) => {
    "use server";
    const result = await updateCompany(params.id, formData);

    if (result.success) {
      redirect("/admin/company");
    }
  };

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Edit Company
      </h1>
      <div className="bg-white border border-gray-300 rounded-xl p-6 text-black">
        <form action={editCompany}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="name" className="block mb-2">
                Company Name
              </label>
              <Input
                type="text"
                name="name"
                id="name"
                defaultValue={company.name}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                id="email"
                defaultValue={company.email}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <div>
              <label htmlFor="phone" className="block mb-2">
                Phone
              </label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                defaultValue={company.phone}
                required
              />
            </div>
            <div>
              <label htmlFor="companyType" className="block mb-2">
                Company Type
              </label>
              <Input
                type="text"
                name="companyType"
                id="companyType"
                defaultValue={company.companyType}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="address" className="block mb-2">
              Address
            </label>
            <Input
              type="text"
              name="address"
              id="address"
              defaultValue={company.address}
              required
            />
          </div>
          <div className="flex flex-row gap-5">
            <Button type="submit" className="mt-4">
              Update Company
            </Button>
            <Link href="/admin/company">
              <Button className="mt-4" variant="outline" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
