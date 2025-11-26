import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fetchCompanies } from "@/lib/actions/company.actions";
import { redirect } from "next/navigation";

export default async function ViewCompanyPage({
  params,
}: {
  params: { id: string };
}) {
  const companies = await fetchCompanies();
  const company = companies.find((c) => c._id.toString() === params.id);

  if (!company) {
    redirect("/admin/company");
  }

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <h1 className="text-black text-2xl font-semibold sm:mb-5 md:mb-2">
        Company Details
      </h1>

      <div className="bg-white border border-gray-300 rounded-xl p-6 text-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Details Card */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Company Information
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-2">
                  <span className="font-medium text-gray-600">
                    Company Name:
                  </span>
                  <p className="text-black">{company.name}</p>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">
                    Company Type:
                  </span>
                  <p className="text-black">{company.companyType}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Contact Details
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-black">{company.email}</p>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <p className="text-black">{company.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Address Details
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="font-medium text-gray-600">Full Address:</span>
                <p className="text-black">{company.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-4">
          <Link href={`/admin/company/edit/${company._id}`}>
            <Button>Edit Company</Button>
          </Link>
          <Link href="/admin/company">
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
