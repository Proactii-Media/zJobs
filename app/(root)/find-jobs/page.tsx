import { Suspense } from "react";
import { getJobs } from "@/lib/actions/job.actions";
import FindJobsLoading from "@/components/FindJobsLoading"; // You'll need to create this component
import dynamic from "next/dynamic";

// Dynamically import the client component
const FindJobsClient = dynamic(() => import("@/components/FindJobsClient"), {
  ssr: false,
  loading: () => <FindJobsLoading />,
});

export default async function FindJobsPage() {
  //* Fetch jobs server-side
  const initialJobs = await getJobs();

  return (
    <Suspense fallback={<FindJobsLoading />}>
      <FindJobsClient initialJobs={initialJobs} />
    </Suspense>
  );
}
