import DynamicModulePage from "../[slug]";
import { findModule } from "@/lib/modules";

const slug = "maskin";
const found = findModule(slug);

export default function ProfessionalMachinePage() {
  if (!found) return null;
  return <DynamicModulePage slug={slug} item={found.item} section={found.section} />;
}

export const getStaticProps = async () => ({ props: { hasHeader: false } });
