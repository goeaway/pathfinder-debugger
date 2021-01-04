import TooltipContext from "@src/context/tooltip-context";
import { useContext } from "react";

const useTooltip = () => useContext(TooltipContext);

export default useTooltip;