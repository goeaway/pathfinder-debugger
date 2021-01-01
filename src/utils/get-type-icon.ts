import { faHiking, faCampground, faMountain, faTree } from "@fortawesome/free-solid-svg-icons";
import { CellType } from "@src/types";

const getTypeIcon = (type: CellType) => {
    switch(type) {
        case "start":
            return faHiking;
        case "end":
            return faCampground;
        case "wall": 
            return faMountain;
        case "weight": 
            return faTree;
    }
}

export default getTypeIcon;