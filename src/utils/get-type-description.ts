import { CellType } from "@src/types"

const getTypeDescription = (type: CellType) => {
    switch (type) {
        case "start":
            return "This is where the algorithm should start from"
        case "end":
            return "This is where the algorithm should end at";
        case "wall":
            return "The algorithm should not pass through these cells";
        case "weight": 
            return "These cells can be more costly than others";
    }
}

export default getTypeDescription;