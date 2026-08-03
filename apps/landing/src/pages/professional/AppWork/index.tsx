import TimeflowWorkPage from "../../timeflow-work";

export default function ProfessionalAppWorkPage() {
  return <TimeflowWorkPage />;
}

export const getStaticProps = async () => ({ props: { hasHeader: false } });
