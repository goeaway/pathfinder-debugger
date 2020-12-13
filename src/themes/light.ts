import { Theme } from "@src/types";

const Light : Theme = { 
    background: {
        one: "#1F2430",
        two: "#232834"
    },
    fontLight: {
        one: "white",
        two: "rgba(255,255,255,.6)"
    },
    fontDark: {
        one: "#1F2430"
    },
    heroSrc: "/assets/heroes/cosmic-blur.jpg",
    breakpoints: {
        xs: 530,
        sm: 768,
        md: 992,
        lg: 1200,
        xl: 1600
    }
}

export default Light;