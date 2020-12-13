import { Theme } from "@src/types";

const Dark : Theme = { 
    background: {
        one: "#1F2430",
        two: "#232834",
        three: "#353d50",
        four: "#4e5974"
    },
    fontLight: {
        one: "white",
        two: "rgba(255,255,255,.6)"
    },
    fontDark: {
        one: "#1F2430"
    },
    heroSrc: "/assets/heroes/astro-blurred.jpg",
    breakpoints: {
        xs: 530,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1600
    }
}

export default Dark;