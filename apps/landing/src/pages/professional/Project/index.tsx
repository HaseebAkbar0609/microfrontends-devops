import DynamicModulePage from "../[slug]";
import { findModule } from "@/lib/modules";

const slug = "projekt";
const found = findModule(slug);

export default function ProfessionalProjectPage() {
  if (!found) return null;
  return <DynamicModulePage slug={slug} item={found.item} section={found.section} />;
}

export const getStaticProps = async () => ({ props: { hasHeader: false } });
