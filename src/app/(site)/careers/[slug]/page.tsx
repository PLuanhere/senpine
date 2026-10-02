import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { careerJobs } from "@/lib/careers";
import { CareerJobDetail } from "@/components/career-job-detail";
import "../careers.css";

export function generateStaticParams() {
  return careerJobs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = careerJobs.find((item) => item.slug === slug);
  return { title: job ? `${job.title.vi} | Tuyển dụng SenPine` : "Không tìm thấy vị trí | SenPine", description: job?.summary.vi };
}

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = careerJobs.find((item) => item.slug === slug);
  if (!job) notFound();
  return <CareerJobDetail job={job} />;
}
