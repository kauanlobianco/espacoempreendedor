import { InfoPage } from "@/features/public/info-page";
import { INFO_PAGES } from "@/lib/constants/domain";

export default function NotaFiscalPage() {
  return <InfoPage content={INFO_PAGES["nota-fiscal"]} />;
}
