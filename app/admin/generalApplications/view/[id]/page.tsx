"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/Loader";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ApplicationDetails {
  _id: string;
  personalDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  educationalDetails: {
    degree: string;
    graduationYear: string;
    university: string;
  };
  professionalDetails: {
    experience: string;
    pdfData: {
      fileName: string;
      contentType: string;
      data: string;
    };
  };
}

const PdfViewer = ({
  pdfData,
}: {
  pdfData: { fileName: string; contentType: string; data: string };
}) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (pdfData?.data) {
      const binaryData = atob(pdfData.data);
      const array = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        array[i] = binaryData.charCodeAt(i);
      }
      const blob = new Blob([array], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfData]);

  if (!pdfUrl)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading PDF...
      </div>
    );

  return (
    <div className="w-full h-[400px] sm:h-[500px] relative">
      <object
        data={pdfUrl}
        type="application/pdf"
        className="w-full h-full rounded-lg"
      >
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="text-center space-y-2 mb-4">
            <p className="text-gray-600 font-medium">
              PDF preview is not available on this device
            </p>
            <p className="text-sm text-gray-500">
              You can download the PDF to view it
            </p>
          </div>
          <a
            href={pdfUrl}
            download={pdfData.fileName}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            Download PDF
          </a>
        </div>
      </object>
    </div>
  );
};

const ViewUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationDetails | null>(
    null
  );
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/generalApplications/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        const userData = await response.json();
        setApplication(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader />
      </div>
    );
  }

  if (!application) {
    return <div>Application not found</div>;
  }

  return (
    <section className="sm:px-5 md:px-1 lg:px-2">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-black text-2xl font-semibold">
          Application Details
        </h1>
        <Button
          onClick={() => router.push("/admin/generalApplications")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Personal Details Card */}
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-black">
                {application.personalDetails?.name}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-blue-500">
                <Link href={`mailto:${application.personalDetails.email}`}>
                  {application.personalDetails.email}
                </Link>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-black">
                {application.personalDetails.phone}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-black">
                {application.personalDetails.address}
              </div>
            </div>
          </div>
        </div>

        {/* Educational Details Card */}
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Educational Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Degree
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-black">
                {application.educationalDetails.degree}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Graduation Year
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-black">
                {application.educationalDetails.graduationYear}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">
                University
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-black">
                {application.educationalDetails.university}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details Card */}
        <div className="bg-white border border-gray-300 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Professional Details
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Experience
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-black">
                {application.professionalDetails.experience}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Resume
              </label>
              <div className="mt-1">
                <div className="text-sm text-gray-600 mb-2">
                  {application.professionalDetails.pdfData?.fileName ||
                    "No resume uploaded"}
                </div>
                {application.professionalDetails.pdfData && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <PdfViewer
                      pdfData={application.professionalDetails.pdfData}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewUser;
