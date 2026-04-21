import { InfoPage } from "@/features/public/info-page";
import { INFO_PAGES } from "@/lib/constants/domain";

export default function AbrirMeiPage() {
  return <InfoPage content={INFO_PAGES["abrir-mei"]} />;
}
